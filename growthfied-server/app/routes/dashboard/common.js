const express = require("express");
const router = express.Router();
const userModal = require("../../models/user.modal");
const { verifyJwtToken } = require("../../utils/auth");

router.get("/user-details", verifyJwtToken, async (req, res) => {
    try {
        const user = await userModal.findById(req.userId).select("-razorpay_keys")
        if (!user) return res.status(404).json({ message: "user not found" })
            
        return res.status(200).json(
        { 
          username: user?.username, 
          profile_picture: user?.profile_picture,
          on_boarding: user?.on_boarding,
          domain_name: user?.domain_name,
          is_domain_enabled: user?.is_domain_enabled,
        });


    } catch (error) {
        console.log("@user_details", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 


module.exports = router