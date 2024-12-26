const express = require("express");
const router = express.Router();
const path = require("path");
const { isImage, imageUpload, removeImage } = require("../../utils/imageUpload");
const { generateUniqueNumber, decryptData } = require("../../utils/common");
const { v4: uuidv4 } = require('uuid');
const tempimageModal = require("../../models/tempimage.modal");
const userModal = require("../../models/user.modal");
const coupenModal = require("../../models/coupen.modal");
const productModal = require("../../models/product.modal");
const { getCoupenStatus, getCoupenPercentDiscount, getItemsDiscount, calculateExpectedDeliveryDate, getTotalPMOfferAmount } = require("../../utils/order");
const orderModal = require("../../models/order.modal");
const { emailTemplate, customerOrderEmailTemplate, adminOrderEmailTemplate } = require("../../utils/emailTemplates");
const { sendEmail } = require("../../utils/sentEmail");
const { BACKEND_URL, FRONTEND_URL } = require("../../config");
const orderId = require('order-id')('key');
const uniqid = require('uniqid'); 
const sha256 = require('sha256');
const axios = require('axios');
const Razorpay = require('razorpay');
const crypto = require('crypto')

router.post("/upload-customer-photos", async (req, res) => {
    
    const uploadedImages = [];
  const imageFields = ['image_one', 'image_two', 'image_three','image_four'];

  for (const field of imageFields) {
    let isImageUploaded = false;
    const image = req.files?.[field];
    if (image && isImage(image)) {
      const imageFileName = `${uuidv4()}-${generateUniqueNumber()}${path.extname(image.name)}`;
      const uploadPath = path.join(__dirname, '../../../public/images/order', imageFileName);
      try {
        await imageUpload(image, uploadPath);
        isImageUploaded = true;
        uploadedImages.push({ file_name: imageFileName });
      } catch (error) {
        console.log(`@${field}_upload`, error);
      }
    }
  }

  try {

    const newTempImages = new tempimageModal({
      images: uploadedImages
    });

    const response = await newTempImages.save();
    res.status(200).json({ message: "photos created successfully", images: uploadedImages, tempimg_id: response.id })

  } catch (error) {
    console.log("@upload_user_photos", error);
    return res.status(500).json({ message: "something went wrong" });
  }
});


router.get("/default-delivery-charge-and-pm/:username", async (req, res) => {
  try {
      const user = await userModal.findOne({ username: req.params.username }).select("delivery_charge payment_method")
      return res.status(200).json({ 
        default_delivery_charge: user?.delivery_charge, 
        payment_method: user?.payment_method
       })
  } catch (error) {
      console.log("@default-delivery-charge", error)
      return res.status(500).json({ message: "something went wrong" })
  }
})

router.get("/coupen-status/:username/:coupen_code", async (req, res) => {
  try {
    const user = await userModal.findOne({ username: req.params.username }).select("_id")
    const coupenCode = await coupenModal.findOne({ coupen_code:  req.params.coupen_code, user_id: user._id})
    
    if(coupenCode){
      const { user_id, _id, __v, createdAt, updatedAt, applies, ...responseData } = coupenCode._doc;
      res.status(200).json({...responseData, status: true})
    }else{
      res.status(200).json({ status: false, message:"invalid coupen" })
    }

  } catch (error) {
    console.log("@coupen_status", error)
    return res.status(500).json({ message: "something went wrong" })
  }
})

router.post("/place-order", async (req, res) => {
  try {
    // Find Store
    const user = await userModal.findOne({ username: req.body.username }).
    select("_id delivery_charge username whatsapp_number profile_picture store_name email razorpay_keys domain_name is_domain_enabled")

    // Fetch product id for each cart item
    const productIds = req.body.items.map(item => item.id);
    const products = await productModal.find({ _id: { $in: productIds }, user_id: user._id, status: "Active" }).
    select("_id selling_price original_price delivery_charge delivery_days discount_based_pm")

    // Update cart prices based on the fetched products
    let isProductMissing = false
    let hasPriceMismatch = false;
    let tempIds = []

    const updatedCart = req.body.items.map(cartItem => {
      const product = products.find(p => p._id.toString() === cartItem.id);
      if (!product) isProductMissing = true 

      if(cartItem.tempimg_id !== null){
        tempIds.push(tempIds)
      }

      // Compare the selling prices
      if (product && cartItem.selling_price !== product.selling_price) {
        hasPriceMismatch = true; // Flag price mismatch
        // Update the original_price and selling_price from the database
      }

      if(product && cartItem?.discount_based_pm && product?.discount_based_pm ){
        if(product && cartItem?.discount_based_pm?.selling_price !== product?.discount_based_pm?.selling_price){
          hasPriceMismatch = true; // Flag price mismatch
        }
      }

      if(product){
        return {
          ...cartItem,
          original_price: product.original_price,
          selling_price: product.selling_price,
          delivery_charge: product.delivery_charge,
          delivery_days: product.delivery_days,
        };
      }

    });

    if(isProductMissing) return res.status(409).json({ code: "CODE1", message: "Some of the product is deleted from the store", updatedCart: updatedCart, updatedDeliveryCharge: user.delivery_charge})
    if(hasPriceMismatch) return res.status(409).json({ code: "CODE2", message: "Product Prices have been updated" , updatedCart: updatedCart, updatedDeliveryCharge: user.delivery_charge})
    if(user.delivery_charge !== req.body.delivery_charge) return res.status(409).json({ code: "CODE3", message: "Delivery Charge have been updated" , updatedDeliveryCharge: user.delivery_charge})

    req.body.items = updatedCart

    // calculate price details

    // find items amount
    let itemsAmount = 0
    const getSomeOfItems = () => {
      return  req.body.items.reduce((acc, { selling_price, quantity }) => acc + selling_price * quantity, 0)
    }
    itemsAmount = getSomeOfItems()

    // find delivery charge
    let deliveryCharge = 0
    const getIsDeliveryChargeEnabled = () => {
      return req.body.items.some(item => item.delivery_charge === 'enable')
    }
    deliveryCharge = getIsDeliveryChargeEnabled() === true ? user.delivery_charge : 0

    // find coupenDiscount
    let coupenDiscount = 0
    if(req.body.coupen_code.applied){
      const coupenCode = await coupenModal.findOne({ user_id: user._id, coupen_code:  req.body.coupen_code.code })
      if(!coupenCode) return res.status(409).json({ code: "CODE4", message: "Your coupen code is not available", updatedDeliveryCharge: user.delivery_charge  })
      const coupenStatus = getCoupenStatus(coupenCode.end_date, coupenCode.used, coupenCode.count)
      if(coupenStatus !== "Running") return res.status(409).json({ code: "CODE5", message: "Your coupen code is expired", updatedDeliveryCharge: user.delivery_charge })
      if(coupenCode.minimum > itemsAmount + deliveryCharge) return res.status(409).json({ code: "CODE6", message: "Coupen Code Minimum Order Amount Changed", updatedDeliveryCharge: user.delivery_charge })
      coupenDiscount = coupenCode.discount.type === "fixed" ? coupenCode.discount.value : getCoupenPercentDiscount(getSomeOfItems(req.body.items), coupenCode.discount.value)

      // reduce coupen used
      await coupenModal.findOneAndUpdate({ user_id: user._id, coupen_code:  req.body.coupen_code.code }, 
        { $inc: { used: 1 } }
      )
    }

    // find pm offer
    let pmOffer = 0
    if(req.body.payment_method === "online"){
      pmOffer = getTotalPMOfferAmount(req.body.items)
    }

    // find netTotal
    let netTotal = 0
    netTotal = itemsAmount + deliveryCharge - coupenDiscount - pmOffer

    // find totalDiscount
    let totalDiscount = 0
    totalDiscount = coupenDiscount + pmOffer

    // reduce product quantiy
      await Promise.all(req.body.items.map(async (item) => {
          const product = await productModal.findById(item.id).select("variants quantity")
          if (product && product.variants.variant_name === "") {
            if(product.quantity !== "unlimited"){
              let currentQuantity = Math.abs(product.quantity);
              let newQuantity = currentQuantity - Math.abs(item.quantity);
              await productModal.findByIdAndUpdate(item.id, { quantity: newQuantity.toString() });
            }
          }
          if (product && product.variants.variant_name !== "") {
             if(item.variant.selected_option === product.variants.options.option_one){
              let currentQuantity = product.variants.options_quantity.option_one
              let newQuantity = currentQuantity - Math.abs(item.quantity)
              await productModal.findByIdAndUpdate(item.id, { 
                "variants.options_quantity.option_one": newQuantity 
               })
             }
             if(item.variant.selected_option === product.variants.options.option_two){
              let currentQuantity = product.variants.options_quantity.option_two
              let newQuantity = currentQuantity - Math.abs(item.quantity)
              await productModal.findByIdAndUpdate(item.id, { 
                "variants.options_quantity.option_two": newQuantity 
               })
             }
             if(item.variant.selected_option === product.variants.options.option_three){
              let currentQuantity = product.variants.options_quantity.option_three
              let newQuantity = currentQuantity - Math.abs(item.quantity)
              await productModal.findByIdAndUpdate(item.id, { 
                "variants.options_quantity.option_three": newQuantity 
               })
             }
             if(item.variant.selected_option === product.variants.options.option_four){
              let currentQuantity = product.variants.options_quantity.option_four
              let newQuantity = currentQuantity - Math.abs(item.quantity)
              await productModal.findByIdAndUpdate(item.id, { 
                "variants.options_quantity.option_four": newQuantity 
               })
             }
          }
      }));  
      
    // handle cash on delivery
    if(req.body.payment_method === "cod"){
      const newOrder = new orderModal({
        store_id: user._id,
        mobile_number: req.body.shipping_address.mobile_number,
        email: req.body.shipping_address.email,
        order_id: orderId.generate(),
        order_date: req.body.date,
        order_time: req.body.time,
        expected_delivery_date: calculateExpectedDeliveryDate(req.body.date, req.body.delivery_days),
        payment_method: "cod",
        items: req.body.items,
        price_details: {
          items_amount: itemsAmount,
          delivery_charge: deliveryCharge,
          coupen_discount: coupenDiscount,
          net_total: netTotal,
          total_discount: totalDiscount,
          pm_offer: pmOffer
        },
        coupen_details: req.body.coupen_code,
        shipping_address: req.body.shipping_address,
        order_status: true,
        order_last_status: "Processing",
        order_progress: [
          { status: "Order Placed", date: req.body.date, time: req.body.time },
          { status: "Order Processing", date: req.body.date, time: req.body.time },
        ],
        is_order_cancelled: false
      });
      const codOrder = await newOrder.save();
      res.status(200).json({ 
        message: "Your Order Processing Successfully",
        order_status: true,
        store_name: user.username,
        order_id: codOrder.order_id,
        customer_phone_number: req.body.shipping_address.mobile_number,
        store_phone_number: user.whatsapp_number,
        is_domain_enabled: user.is_domain_enabled,
        domain_name: user.domain_name,
      })

      // sent email to customer
      const domainName = user.is_domain_enabled ? user.domain_name : `${user.username}.${FRONTEND_URL}`
      const dataForCustomer = {
        store_image: `${BACKEND_URL}/public/images/profiles/${user.profile_picture}`,
        store_name: `${user.store_name}`,
        customer_name: `${req.body.shipping_address.full_name}`,
        content: `Thank you for your order. Your order is successful and it is under process, Order Id: ${newOrder.order_id}`,
        tracking_link: `http://${domainName}/track-order?ph=${req.body.shipping_address.mobile_number}&order_id=${codOrder.order_id}`,
        store_whatsapp_number: `${user.whatsapp_number}`
      }

      const htmlForCustomer = customerOrderEmailTemplate(dataForCustomer)
      await sendEmail(req.body.shipping_address.email, `Your Order is confirmed - ${codOrder.order_id}`, htmlForCustomer);
      
      // sent email to admin
      const dataForAdmin = {
        store_image: `${BACKEND_URL}/public/images/profiles/${user.profile_picture}`,
        store_name: `${user.store_name}`,
        content: `A new order has been placed on the website. Please click view details for order information`,
        tracking_link: `http://${FRONTEND_URL}/dashboard/orders/${codOrder._id}`,
      }

      const htmlForAdmin = adminOrderEmailTemplate(dataForAdmin)
      return await sendEmail(user.email, `Your have new order - ${codOrder.order_id}`, htmlForAdmin);
      
    }
  

    // handle cash on online
    if(req.body.payment_method === "online"){
      // Razorpay Payment Gateway Integration
      const newOrderId = orderId.generate()
      const razorpay = new Razorpay({ 
        key_id: `${decryptData(user.razorpay_keys.key_id)}`, 
        key_secret: `${decryptData(user.razorpay_keys.key_secret)}`
      })

      const razorpayResponse = await razorpay.orders.create({
         amount: netTotal * 100,
         currency: "INR",
         receipt: newOrderId,
      })

      const newOrder = new orderModal({
        store_id: user._id,
        mobile_number: req.body.shipping_address.mobile_number,
        email: req.body.shipping_address.email,
        order_id: newOrderId,
        order_date: req.body.date,
        order_time: req.body.time,
        expected_delivery_date: calculateExpectedDeliveryDate(req.body.date, req.body.delivery_days),
        payment_method: "online",
        items: req.body.items,
        price_details: {
          items_amount: itemsAmount,
          delivery_charge: deliveryCharge,
          coupen_discount: coupenDiscount,
          net_total: netTotal,
          total_discount: totalDiscount,
          pm_offer: pmOffer
        },
        coupen_details: req.body.coupen_code,
        shipping_address: req.body.shipping_address,
        order_status: false,
        order_last_status: "Processing",
        order_progress: [
          { status: "Order Placed", date: req.body.date, time: req.body.time },
          { status: "Order Processing", date: req.body.date, time: req.body.time },
        ],
        is_order_cancelled: false,
        razorpay_order_id: razorpayResponse.id
      });

      const onlineOrder = await newOrder.save();

      return res.status(200).json({ 
        message: "Order & Payment Initiated", 
        id: razorpayResponse.id,
        key_id: `${decryptData(user.razorpay_keys.key_id)}`,
        order_id: onlineOrder.order_id,
        store_name: user.store_name,
        profile_picture: user.profile_picture,
        customer_phone_number: req.body.shipping_address.mobile_number,
        store_phone_number: user.whatsapp_number
      })

    }

  } catch (error) {
    console.log("@place-order", error)
    return res.status(500).json({ message: "something went wrong" })
  }
})

router.post("/verify-razorpay-payment", async (req, res) => {
  const { 
    order_id, 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature, 
    username
  }
   = req.body
  try {
    // get store
    const store = await userModal.findOne({ username: username }).
    select("_id profile_picture store_name username whatsapp_number email razorpay_keys domain_name is_domain_enabled")

    const onlineOrder = await orderModal.findOneAndUpdate({ 
      order_id: order_id, razorpay_order_id: razorpay_order_id
    }, {
      order_status: true,
      online_payment_status: true,
      razorpay_payment_id: razorpay_payment_id
    },
    { new: true }
    )

    if(!onlineOrder) return res.status(404).json({ message: "Order not found!"})

    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", `${decryptData(store.razorpay_keys.key_secret)}`);
    shasum.update(`${onlineOrder.razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpay_signature){
      await orderModal.findOneAndUpdate({ 
        order_id: order_id, razorpay_order_id: razorpay_order_id 
      }, {
        order_status: false,
        online_payment_status: false
      })
      return res.status(400).json({ message: "Transaction not legit!" });
    }

    res.status(200).json({ 
      message: "Your Order Completed Successfully",
      order_status: true,
      is_domain_enabled: store.is_domain_enabled,
      domain_name: store.domain_name,
    })

    // sent email to customer
    const domainName = store.is_domain_enabled ? user.domain_name : `${user.username}.${FRONTEND_URL}`
    const dataForCustomer = {
      store_image: `${BACKEND_URL}/public/images/profiles/${store.profile_picture}`,
      store_name: `${store.store_name}`,
      customer_name: `${onlineOrder.shipping_address.full_name}`,
      content: `Thank you for your order. Your order is successful and it is under process, Order Id: ${onlineOrder.order_id}`,
      tracking_link: `http://${domainName}/track-order?ph=${onlineOrder.shipping_address.mobile_number}&order_id=${onlineOrder.order_id}`,
      store_whatsapp_number: `${store.whatsapp_number}`
    }

    const htmlForCustomer = customerOrderEmailTemplate(dataForCustomer)
    await sendEmail(onlineOrder.shipping_address.email, `Your Order is confirmed - ${onlineOrder.order_id}`, htmlForCustomer);
    
    // sent email to admin
    const dataForAdmin = {
      store_image: `${BACKEND_URL}/public/images/profiles/${store.profile_picture}`,
      store_name: `${store.store_name}`,
      content: `A new order has been placed on the website. Please click view details for order information`,
      tracking_link: `http://${FRONTEND_URL}/dashboard/orders/${onlineOrder._id}`,
    }

    const htmlForAdmin = adminOrderEmailTemplate(dataForAdmin)
    return await sendEmail(store.email, `Your have new order - ${onlineOrder.order_id}`, htmlForAdmin);
    
  } catch (error) {
    console.log("@verify-razorpay-payment", error)
    return res.status(500).json({ message: "something went wrong" })
  }
})

router.get("/track-order", async (req, res) => {
  try {
    // Find Store
    const store = await userModal.findOne({ username: req.query.store_name }).select("_id whatsapp_number")

    const trackingDetails = await orderModal.findOne({
      store_id: store._id,
      order_id: req.query.order_id,
      mobile_number: req.query.phone_number
    })
    
    if(!trackingDetails) return res.status(404).json({ message: "Order not found!"})

      // Function to remove specific keys from objects in the array
      function removeKeys(array, keysToRemove) {
        return array.map(item => {
          const newItem = { ...item }; // Create a shallow copy of the object
          keysToRemove.forEach(key => {
            delete newItem[key]; // Remove the key
          });
          return newItem;
        });
      }

    return res.status(200).json({ 
      message: "Order details fetched successfully", 
      tracking_details: {
        order_id: trackingDetails.order_id,
        order_date: trackingDetails.order_date,
        order_time: trackingDetails.order_time,
        expected_delivery_date: trackingDetails.expected_delivery_date,
        payment_method: trackingDetails.payment_method,
        items: removeKeys(trackingDetails.items, ["id", "customer_photos", "tempimg_id", "additional_message"]),
        price_details: trackingDetails.price_details,
        shipping_address: trackingDetails.shipping_address,
        coupen_details: trackingDetails.coupen_details,
        order_progress: trackingDetails.order_progress,
        order_last_status: trackingDetails.order_last_status,
        store_whatsapp_number: store.whatsapp_number,
        custom_tracking_url: trackingDetails.custom_tracking_url
      }
    })

    return
  } catch (error) {
    console.log("@place-order", error)
    return res.status(500).json({ message: "something went wrong" })
  }
})

module.exports = router;
