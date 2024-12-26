const express = require("express");
const router = express.Router();
const pageModal = require("../../models/page.modal");
const userModal = require("../../models/user.modal");

router.get("/get-single-page/:store_name/:slug", async (req, res) => {
    try {
        const store = await userModal.findOne({ username: req.params.store_name }).select('store_name')
        const pages = await pageModal.findOne({ user_id: store._id, slug: req.params?.slug }).select('-_id -user_id');  
        return res.status(200).json(pages)
  } catch (error) {
    console.log("@get_single_page", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

module.exports = router;
