const express = require("express");
const router = express.Router();
const path = require("path");
const categoryModal = require("../../models/category.modal");
const { verifyJwtToken } = require("../../utils/auth");
const { isImage, imageUpload, removeImage } = require("../../utils/imageUpload");
const { generateUniqueNumber } = require("../../utils/common");

router.post("/create-category", verifyJwtToken, async (req, res) => {
    const userId = req.userId;

    // image upload
    let isCategoryImageUploaded = false
    let category_image = req.files?.image;
    let categoryImageFileName
    if(category_image && await isImage(category_image)) {
     categoryImageFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(category_image.name)}`;
     uploadPath = path.join(__dirname, '../../../public/images/categories', categoryImageFileName);
    try {
     await imageUpload(category_image, uploadPath);
     isCategoryImageUploaded = true;
    } catch (error) {
     console.log("@image_one_upload", error);}
    }

  try {
    const newCategory = new categoryModal({
        image: isCategoryImageUploaded ? categoryImageFileName : "no_image",
        category_name: req.body?.category_name,
        user_id: userId,
    })

    const category = await newCategory.save();

    return res.status(200).json({ message: "category created successfully", category_id: category._id })

  } catch (error) {
    console.log("@create_category", error);
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/get-all", verifyJwtToken, async (req, res) => {
  const userId = req.userId;

  try {
    const categories = await categoryModal.find({ user_id: userId }).sort({ createdAt: -1 });
    return res.status(200).json(categories)
  } catch (error) {
    console.log("@get_categories", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.get("/get-active", verifyJwtToken, async (req, res) => {
  const userId = req.userId;

  try {
    const categories = await categoryModal.find({ user_id: userId, status: "Active" }).sort({ createdAt: -1 });
    return res.status(200).json(categories)
  } catch (error) {
    console.log("@get_categories", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.put("/delete/:id", verifyJwtToken, async (req, res) => {
  const id = req.params?.id
  const userId = req.userId
  if(req.body?.image !== "no_image" && req.body?.image !== undefined) removeImage("categories", req.body.image)
  
  try {
    await categoryModal.findOneAndDelete({_id: id, user_id: userId})
    res.status(200).json({ message: "category deleted successfully"})
  } catch (error) {
    console.log("@delete_category", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.put("/update-status/:id", verifyJwtToken, async (req, res) => {
  const id = req.params?.id
  const status = req.body?.status
  const userId = req?.userId
  
  try {
    await categoryModal.findOneAndUpdate({ _id: id, user_id: userId}, { status: status === "Active" ? "Draft" : "Active"  })
    res.status(200).json({ message: "category status update successfully"})
  } catch (error) {
    console.log("@update_category_status", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.put("/update/:id", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    const id = req.params.id
    const { prev_category_image } = req.body

    if(req.body.image === "no_image") removeImage("categories", prev_category_image)
    let isCategoryImageUpload = false
    let categoryImageFileName
    category_image = req.files?.image;
    if(category_image && isImage(category_image)) {
        removeImage("categories", prev_category_image)
        categoryImageFileName = `${userId + `-` + generateUniqueNumber()}${path.extname(category_image.name)}`;
        uploadPath = path.join(__dirname, '../../../public/images/categories', categoryImageFileName);
     try {
        await imageUpload(category_image, uploadPath);
        isCategoryImageUpload = true;
    } catch (error) {
        console.log("@profile_upload", error);
    }
    }
  
  try {
    await categoryModal.findOneAndUpdate({ _id: id, user_id: userId}, { 
      category_name: req.body.category_name,
      image: isCategoryImageUpload ? categoryImageFileName : req.body.image === "no_image" ? "no_image" : req.body.prev_category_image
    })

    res.status(200).json({ message: "category update successfully"})
  } catch (error) {
    console.log("@update_status", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

module.exports = router;
