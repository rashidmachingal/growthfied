const express = require("express");
const router = express.Router();
const coupenModal = require("../../models/coupen.modal");
const { verifyJwtToken } = require("../../utils/auth");
const pageModal = require("../../models/page.modal");
const { convertToSlug } = require("../../utils/common");

router.post("/create", verifyJwtToken, async (req, res) => {
    const userId = req.userId;
  try {
    const currentSlug = convertToSlug(req.body.page_title)
    const isAlready = await pageModal.findOne({ user_id: userId, slug: currentSlug })
    if(isAlready) return res.status(409).json({ message: "This page is already exist" })


    const newPage = new pageModal({
        user_id: userId,
        page_title: req.body.page_title,
        page_content: req.body.page_content,
        slug: currentSlug
    })

    await newPage.save();

    return res.status(200).json({ message: "page created successfully" })

  } catch (error) {
    console.log("@create_page", error);
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/update/:id", verifyJwtToken, async (req, res) => {
    const userId = req.userId;
  try {
    const currentSlug = convertToSlug(req.body.page_title)
    const isAlready = await pageModal.findOne({ user_id: userId, slug: currentSlug })
    
    if(isAlready){
      if(isAlready?._id?.toString() !== req.body?._id){
        return res.status(409).json({ message: "This page is already exist" })
      }
    }

    await pageModal.findOneAndUpdate({ _id: req.params.id, user_id: userId },{
        user_id: userId,
        page_title: req.body.page_title,
        page_content: req.body.page_content,
        slug: currentSlug
  })

    return res.status(200).json({ message: "page updated successfully" })

  } catch (error) {
    console.log("@udpate_page", error);
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/get-all", verifyJwtToken, async (req, res) => {
  const userId = req.userId;

  try {
    const pages = await pageModal.find({ user_id: userId }).sort({ createdAt: -1 });
    return res.status(200).json(pages)
  } catch (error) {
    console.log("@get_pages", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.get("/get-single/:id", verifyJwtToken, async (req, res) => {
  const userId = req.userId;
  try {
    const page = await pageModal.findOne({ user_id: userId, _id: req.params.id })
    return res.status(200).json(page)
  } catch (error) {
    console.log("@get_single_page", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.put("/delete/:id", verifyJwtToken, async (req, res) => {
  const id = req.params?.id
  const userId = req.userId
  
  try {
    await pageModal.findOneAndDelete({_id: id, user_id: userId})
    res.status(200).json({ message: "page deleted successfully"})
  } catch (error) {
    console.log("@delete_page", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

module.exports = router;
