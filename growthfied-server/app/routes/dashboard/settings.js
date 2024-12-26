const express = require("express");
const router = express.Router();
const path = require('path');
const userModal = require("../../models/user.modal");
const bcrypt = require("bcrypt")
const { verifyJwtToken, removeAllSessionsForUser, createJwtToken } = require("../../utils/auth");
const { isImage, imageUpload, removeImage } = require("../../utils/imageUpload");
const { generateUniqueNumber, encryptData } = require("../../utils/common");
const { sendEmail } = require("../../utils/sentEmail");
const pg_phonepeModal = require("../../models/pg_phonepe.modal");

router.put("/update-username", verifyJwtToken, async (req, res) => {
    const { username } = req.body;
    const userId = req.userId

    try {
        const isAlreadyUsername = await userModal.findOne({ username: username });
        if (isAlreadyUsername) return res.status(409).json({ message: "subdomain already in use, please choose another"})

        await userModal.findByIdAndUpdate(userId, { username: username });
        return res.status(200).json({ message: "username updated successfully" });

    } catch (error) {
        console.log("@complete_profile", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 

router.get("/default-delivery-charge", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    try {
        const user = await userModal.findById(userId)
        return res.status(200).json({ default_delivery_charge: user.delivery_charge })
    } catch (error) {
        console.log("@default-delivery-charge", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.get("/get-payment-method-info", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    try {
        const user = await userModal.findById(userId)
        return res.status(200).json({ payment_method: user.payment_method })
    } catch (error) {
        console.log("@default-delivery-charge", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.put("/switch-cod", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    try {
        await userModal.findByIdAndUpdate(
            userId, 
            { "payment_method.cod": req.body.cod },
            { new: true }
          );          
        return res.status(200).json({ message: "cod swiched successfully", status: req.body.cod });

    } catch (error) {
        console.log("@switch-cod", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.post("/enable-razorpay-pg", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    try {
        // update online payment status
        await userModal.findByIdAndUpdate(
            userId, 
            { 
              "payment_method.online.enabled": true,
              "payment_method.online.pg_name": req.body.pg_name,
              "razorpay_keys.key_id": encryptData(req.body.key_id),
              "razorpay_keys.key_secret": encryptData(req.body.key_secret),
             },
            { new: true }
        );

        return res.status(200).json({ message: "Razorpay payment gateway enabled successfully", status: req.body.cod });

    } catch (error) {
        console.log("@enable-razorpay-pg", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.post("/disable-online-payment", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    try {
        // update online payment status
        await userModal.findByIdAndUpdate(
            userId, 
            { 
              "payment_method.online.enabled": false,
              "razorpay_keys.key_id": "",
              "razorpay_keys.key_secret": "",
             },
            { new: true }
        );

        return res.status(200).json({ message: "Disable online payment"})

    } catch (error) {
        console.log("@disable_online_payment", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.put("/update-delivery-charge", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    try {
        await userModal.findByIdAndUpdate(userId, { delivery_charge: req.body.delivery_charge });
        return res.status(200).json({ message: "delivery charge updated successfully" });

    } catch (error) {
        console.log("@update-delivery-charge", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 

router.get("/profile-info", verifyJwtToken, async (req, res) => {
    const userId = req.userId

    try {
        const user = await userModal.findById(userId)
        return res.status(200).json(
          {
            store_name: user.store_name,
            bio: user?.bio,
            email: user.email,
            mobile_number: user.mobile_number,
            whatsapp_number: user.whatsapp_number
          }
        )
    } catch (error) {
        console.log("@complete_profile", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.put("/update-profile-info", verifyJwtToken, async (req, res) => {

    const { store_name, bio, mobile_number, whatsapp_number, prev_profile } = req.body;
    const userId = req.userId
    
    // image upload
    if(req.body.profile_picture !== prev_profile) removeImage("profiles", prev_profile)
    let isProfileUpload = false
    let profileFileName
    profile_picture = req.files?.profile_picture;
    if(profile_picture && isImage(profile_picture)) {
        removeImage("profiles", prev_profile)
        const profilePictureFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(profile_picture.name)}`;
        profileFileName = profilePictureFileName
        uploadPath = path.join(__dirname, '../../../public/images/profiles', profilePictureFileName);
     try {
        await imageUpload(profile_picture, uploadPath);
        isProfileUpload = true;
    } catch (error) {
        console.log("@profile_upload", error);
    }
    }

    try {
       await userModal.findByIdAndUpdate(userId, {
            store_name,
            profile_picture: isProfileUpload ? profileFileName : req.body.profile_picture,
            bio,
            mobile_number,
            whatsapp_number,
            on_boarding: true,
        });

       return res.status(200).json({ profile_picture: profileFileName || req.body.profile_picture, message: "profile updated successfully"});

    } catch (error) {
        console.log("@complete_profile", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 

router.get("/get-store-details", verifyJwtToken, async (req, res) => {
    try {
        const userId = req.userId
        const store = await userModal.findById(userId)

        if(store === null) return res.status(404).json({ message: "sorry, this store not found!"})

        return res.status(200).json({ 
          store_name: store.username, 
          bio: store.bio,
          profile_picture: store.profile_picture,
          meta_title: store.meta_title,
          meta_description: store.meta_description,
          favicon: store.favicon
        });

    } catch (error) {
        console.log("@get_store_details", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.put("/update-seo-info", verifyJwtToken, async (req, res) => {
    const { meta_title, meta_description, prev_favicon } = req.body;
    const userId = req.userId
    
    // image upload
    if(req.body.favicon !== prev_favicon) removeImage("favicons", prev_favicon)
        let isFaviconUpload = false
        let faviconFileName
        favicon = req.files?.favicon;
        if(favicon && isImage(favicon)) {
            removeImage("favicons", prev_favicon)
            const faviconPictureFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(favicon.name)}`;
            faviconFileName = faviconPictureFileName
            uploadPath = path.join(__dirname, '../../../public/images/favicons', faviconPictureFileName);
         try {
            await imageUpload(favicon, uploadPath);
            isFaviconUpload = true;
        } catch (error) {
            console.log("@favicon_upload", error);
        }
    }

    try {
       await userModal.findByIdAndUpdate(userId, {
            meta_title,
            meta_description,
            favicon: isFaviconUpload ? faviconFileName : req.body.favicon
       });

       return res.status(200).json({ favicon: faviconFileName || req.body.favicon, message: "favicon updated successfully"});

    } catch (error) {
        console.log("@update-seo-info", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 

router.get("/get-footer-info", verifyJwtToken, async (req, res) => {
    try {
        const userId = req.userId
        const store = await userModal.findById(userId).select("footer")

        if(store === null) return res.status(404).json({ message: "sorry, this store not found!"})

        return res.status(200).json({ 
          footer: store.footer
        });

    } catch (error) {
        console.log("@get_footer_info", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.put("/update-footer-info", verifyJwtToken, async (req, res) => {
    const { footer } = req.body;
    const userId = req.userId

    try {
       await userModal.findByIdAndUpdate(userId, {
            footer: footer
       });
       return res.status(200).json({ message: "footer updated successfully"});

    } catch (error) {
        console.log("@update_footer_info", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 

module.exports = router