const express = require("express");
const router = express.Router();
const userModal = require("../../models/user.modal");
const pageModal = require("../../models/page.modal");

router.get("/get-store-details/:username", async (req, res) => {
    try {
        const store = await userModal.findOne({ username: req.params.username }).select('store_name bio profile_picture meta_title meta_description favicon footer analytics_id')
        if(store === null) return res.status(404).json({ message: "sorry, this store not found!"})
        const pages = await pageModal.find({ user_id: store?._id }).select('page_title slug -_id');   


        return res.status(200).json({ 
          store_name: store.store_name, 
          bio: store.bio,
          profile_picture: store.profile_picture,
          meta_title: store.meta_title,
          meta_description: store.meta_description,
          favicon: store.favicon,
          pages: pages,
          footer: store?.footer,
          analytics_id: store?.analytics_id
        });

    } catch (error) {
        console.log("@get_store_details", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 


module.exports = router