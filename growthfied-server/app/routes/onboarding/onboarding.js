const express = require("express");
const path = require('path');
const router = express.Router();
const userModal = require("../../models/user.modal");
const { verifyJwtToken } = require("../../utils/auth");
const { imageUpload, isImage } = require("../../utils/imageUpload");
const { generateUniqueNumber } = require("../../utils/common");

router.put("/complete-profile", verifyJwtToken, async (req, res) => {
    const { whatsapp_number, bio, store_name, meta_title, meta_description } = req.body;
    const userId = req.userId

    let isProfileUpload = false
    let profileFileName
    profile_picture = req.files?.profile_picture;

    if(profile_picture && await isImage(profile_picture)) {
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
        const updatedUser = await userModal.findByIdAndUpdate(userId, {
            profile_picture: isProfileUpload ? profileFileName : "no_profile",
            store_name,
            whatsapp_number,
            bio,
            meta_title: `${store_name} - Online Store`,
            meta_description: bio,
            on_boarding: true,
        });

       return res.status(200).json(
        { 
          username: updatedUser.username, 
          profile_picture: isProfileUpload ? profileFileName : "no_profile", 
          message: "profile completed successfully" 
        });

    } catch (error) {
        console.log("@complete_profile", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 


module.exports = router