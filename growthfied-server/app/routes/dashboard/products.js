const express = require("express");
const router = express.Router();
const path = require("path");
const productModal = require("../../models/product.modal");
const { verifyJwtToken } = require("../../utils/auth");
const { isImage, imageUpload, removeImage } = require("../../utils/imageUpload");
const { generateUniqueNumber } = require("../../utils/common");

router.post("/create-product", verifyJwtToken, async (req, res) => {
    const userId = req.userId;

    // images upload
    let isImageOneUploaded = false
    let image_one = req.files?.image_one;
    let imageOneFileName
    if(image_one && isImage(image_one)) {
     imageOneFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(image_one.name)}`;
     profileFileName = imageOneFileName
     uploadPath = path.join(__dirname, '../../../public/images/products', imageOneFileName);
    try {
     await imageUpload(image_one, uploadPath);
     isImageOneUploaded = true;
    } catch (error) {
     console.log("@image_one_upload", error);}
    }

    let isImageTwoUploaded = false
    let image_two = req.files?.image_two;
    let imageTwoFileName
    if(image_two && isImage(image_two)) {
     imageTwoFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(image_two.name)}`;
     profileFileName = imageTwoFileName
     uploadPath = path.join(__dirname, '../../../public/images/products', imageTwoFileName);
    try {
      await imageUpload(image_two, uploadPath);
      isImageTwoUploaded = true;
    } catch (error) {
      console.log("@image_two_upload", error);}
    }

    let isImageThreeUploaded = false
    let image_three = req.files?.image_three;
    let imageThreeFileName
    if(image_three && isImage(image_three)) {
     imageThreeFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(image_three.name)}`;
     profileFileName = imageThreeFileName
     uploadPath = path.join(__dirname, '../../../public/images/products', imageThreeFileName);
    try {
      await imageUpload(image_three, uploadPath);
      isImageThreeUploaded = true;
    } catch (error) {
      console.log("@image_three_upload", error);}
    }

  try {
    // make unique slug
    const isSlugAlready = await productModal.findOne({ slug: req.body?.slug, user_id: userId });
    if (isSlugAlready) {
      let suffix = 1;
      while (await productModal.findOne({ slug: `${req.body?.slug}-${suffix}`, user_id: userId })) {
        suffix++;
      }
      req.body.slug = `${req.body?.slug}-${suffix}`;
    }

    const newProduct = new productModal({
      user_id: userId,
      images: {
        image_one: isImageOneUploaded ? imageOneFileName : "no_image",
        image_two: isImageTwoUploaded ? imageTwoFileName : "no_image",
        image_three: isImageThreeUploaded ? imageThreeFileName : "no_image"
      },
      status: req.body?.status,
      title: req.body?.title,
      description: req.body?.description,
      selling_price: Math.abs(req.body?.selling_price),
      original_price: Math.abs(req.body?.original_price),
      quantity: req.body?.quantity === "unlimited" ? req.body?.quantity : Math.abs(req.body?.quantity),
      limit_per_order: JSON.parse(req.body?.limit_per_order),
      delivery_days: Math.abs(req.body?.delivery_days),
      delivery_charge: req.body?.delivery_charge,
      variants: JSON.parse(req.body?.variants),
      accept_images: JSON.parse(req.body?.accept_images),
      accept_message: JSON.parse(req.body?.accept_message),
      discount_based_pm: JSON.parse(req.body?.discount_based_pm),
      seo: {
        allow: JSON.parse(req.body.seo).allow,
        meta_title: JSON.parse(req.body.seo).meta_title === "" ? req.body.title : JSON.parse(req.body.seo).meta_title,
        meta_description: JSON.parse(req.body.seo).meta_description === "" ? req.body.description : JSON.parse(req.body.seo).meta_description
      },
      categories: JSON.parse(req.body?.categories),
      payment_methods: JSON.parse(req.body?.payment_methods),
      slug: req.body?.slug
    });

    await newProduct.save();
    res.status(200).json({ message: "product created successfully"})

  } catch (error) {
    console.log("@create_product", error);
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/edit-product", verifyJwtToken, async (req, res) => {
  const userId = req.userId;
  const prevImages = JSON.parse(req.body?.prev_images)

  
    // images upload
    if(req.body?.image_one === "no_image") removeImage("products", prevImages?.image_one)
    let isImageOneUploaded = false
    let image_one = req.files?.image_one;
    let imageOneFileName
    if(image_one && isImage(image_one)) {
     removeImage("products", prevImages?.image_one)
     imageOneFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(image_one.name)}`;
     profileFileName = imageOneFileName
     uploadPath = path.join(__dirname, '../../../public/images/products', imageOneFileName);
    try {
     await imageUpload(image_one, uploadPath);
     isImageOneUploaded = true;
    } catch (error) {
     console.log("@image_one_upload", error);}
    }

    if(req.body?.image_two === "no_image") removeImage("products", prevImages?.image_two)
    let isImageTwoUploaded = false
    let image_two = req.files?.image_two;
    let imageTwoFileName
    if(image_two && isImage(image_two)) {
     removeImage("products", prevImages?.image_two)
     imageTwoFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(image_two.name)}`;
     profileFileName = imageTwoFileName
     uploadPath = path.join(__dirname, '../../../public/images/products', imageTwoFileName);
    try {
      await imageUpload(image_two, uploadPath);
      isImageTwoUploaded = true;
    } catch (error) {
      console.log("@image_two_upload", error);}
    }

    if(req.body?.image_three === "no_image") removeImage("products", prevImages?.image_three)
    let isImageThreeUploaded = false
    let image_three = req.files?.image_three;
    let imageThreeFileName
    if(image_three && isImage(image_three)) {
     removeImage("products", prevImages?.image_three)
     imageThreeFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(image_three.name)}`;
     profileFileName = imageThreeFileName
     uploadPath = path.join(__dirname, '../../../public/images/products', imageThreeFileName);
    try {
      await imageUpload(image_three, uploadPath);
      isImageThreeUploaded = true;
    } catch (error) {
      console.log("@image_three_upload", error);}
    }

  try {
    // make unique slug
    const isSlugAlready = await productModal.findOne({ slug: req.body?.slug, user_id: userId });

      if(isSlugAlready){
        if(isSlugAlready?.slug === req.body?.slug){
          if(isSlugAlready?._id?.toString() !== req.body?._id){
            let suffix = 1;
            while (await productModal.findOne({ slug: `${req.body?.slug}-${suffix}`, user_id: userId })) {
              suffix++;
            }
            req.body.slug = `${req.body?.slug}-${suffix}`;
          }
        }
      }
    
   
    await productModal.findOneAndUpdate({ _id: req.body?._id, user_id: userId }, {
      user_id: userId,
      images: {
        image_one: isImageOneUploaded ? imageOneFileName : req.body?.image_one,
        image_two: isImageTwoUploaded ? imageTwoFileName : req.body?.image_two,
        image_three: isImageThreeUploaded ? imageThreeFileName : req.body?.image_three
      },
      status: req.body?.status,
      title: req.body?.title,
      description: req.body?.description,
      selling_price: Math.abs(req.body?.selling_price),
      original_price: Math.abs(req.body?.original_price),
      quantity: req.body?.quantity === "unlimited" ? req.body?.quantity : Math.abs(req.body?.quantity),
      limit_per_order: JSON.parse(req.body?.limit_per_order),
      delivery_days: Math.abs(req.body?.delivery_days),
      delivery_charge: req.body?.delivery_charge,
      variants: JSON.parse(req.body?.variants),
      accept_images: JSON.parse(req.body?.accept_images),
      accept_message: JSON.parse(req.body?.accept_message),
      discount_based_pm: JSON.parse(req.body?.discount_based_pm),
      seo: {
        allow: JSON.parse(req.body.seo).allow,
        meta_title: JSON.parse(req.body.seo).meta_title === "" ? req.body.title : JSON.parse(req.body.seo).meta_title,
        meta_description: JSON.parse(req.body.seo).meta_description === "" ? req.body.description : JSON.parse(req.body.seo).meta_description
      },
      categories: JSON.parse(req.body?.categories),
      payment_methods: JSON.parse(req.body?.payment_methods),
      slug: req.body?.slug
    })

    res.status(200).json({ message: "product edited successfully"})

  } catch (error) {
    console.log("@edit_product", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.get("/get-all", verifyJwtToken, async (req, res) => {
  const userId = req.userId
  try {
    const products = await productModal.find({ user_id: userId }).sort({ createdAt: -1 });
    return res.status(200).json(products)
  } catch (error) {
    console.log("@get_products", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.get("/get-single/:id", verifyJwtToken, async (req, res) => {
  const userId = req.userId
  const Id = req.params.id
  try {
    const product = await productModal.findOne({ user_id: userId, _id: Id });
    return res.status(200).json(product)
  } catch (error) {
    console.log("@get_single_roduct", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.put("/delete/:id", verifyJwtToken, async (req, res) => {
  const id = req.params?.id
  const userId = req.userId

  if(req.body?.images?.image_one !== "no_image" && req.body?.images.image_one !== undefined){
    removeImage("products", req.body.images?.image_one)
  }

  if(req.body?.images?.image_two !== "no_image" && req.body?.images.image_two !== undefined){
    removeImage("products", req.body.images?.image_two)
  }

  if(req.body?.images?.image_three !== "no_image" && req.body?.images.image_three !== undefined){
    removeImage("products", req.body.images?.image_three)
  }

  try {
    await productModal.findOneAndDelete({_id: id, user_id: userId})
    res.status(200).json({ message: "product deleted successfully"})
  } catch (error) {
    console.log("@delete_product", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.put("/update-status/:id", verifyJwtToken, async (req, res) => {
  
  const id = req.params?.id
  const status = req.body?.status
  const userId = req?.userId
  
  try {
    await productModal.findOneAndUpdate(
      { _id: id, user_id: userId}, 
      { status: status === "Active" ? "Draft" : "Active"  }
    )
    res.status(200).json({ message: "product status update successfully"})
  } catch (error) {
    console.log("@update_product_status", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

module.exports = router;
