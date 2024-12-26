const express = require("express");
const router = express.Router();
const coupenModal = require("../../models/coupen.modal");
const { verifyJwtToken } = require("../../utils/auth");

router.post("/create-coupen", verifyJwtToken, async (req, res) => {
    const userId = req.userId;
  try {

    isAlready = await coupenModal.findOne({ coupen_code: req.body?.coupen_code?.toUpperCase(), user_id: userId })
    if(isAlready !== null) res.status(409).json({ message: "This coupen code is already exist" })

    const newCoupen = new coupenModal({
        user_id: userId,
        coupen_code: req.body?.coupen_code?.toUpperCase(),
        applies: req.body?.applies,
        discount: req.body?.discount,
        minimum: req.body?.minimum,
        count: req.body?.count,
        end_date: req.body?.end_date
    })

    await newCoupen.save();

    return res.status(200).json({ message: "coupen created successfully" })

  } catch (error) {
    console.log("@create_coupen", error);
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/update/:id", verifyJwtToken, async (req, res) => {
    const userId = req.userId;

    isAlready = await coupenModal.findOne({ coupen_code: req.body?.coupen_code?.toUpperCase(), user_id: userId })
    if(isAlready !== null){
      if(isAlready._id?.toString() === req.params.id) return res.status(409).json({ message: "This coupen code is already exist" })
    }
  try {
    await coupenModal.findOneAndUpdate({ _id: req.params.id, user_id: userId },{
      user_id: userId,
      coupen_code: req.body?.coupen_code?.toUpperCase(),
      applies: req.body?.applies,
      discount: req.body?.discount,
      minimum: req.body?.minimum,
      count: req.body?.count,
      end_date: req.body?.end_date
  })

    return res.status(200).json({ message: "coupen updated successfully" })

  } catch (error) {
    console.log("@udpate_coupen", error);
    return res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/get-all", verifyJwtToken, async (req, res) => {
  const userId = req.userId;

  try {
    const coupens = await coupenModal.find({ user_id: userId }).sort({ createdAt: -1 });
    return res.status(200).json(coupens)
  } catch (error) {
    console.log("@get_coupens", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.get("/get-single/:id", verifyJwtToken, async (req, res) => {
  const userId = req.userId;
  try {
    const coupens = await coupenModal.findOne({ user_id: userId, _id: req.params.id })
    return res.status(200).json(coupens)
  } catch (error) {
    console.log("@get_single_coupen", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

router.put("/delete/:id", verifyJwtToken, async (req, res) => {
  const id = req.params?.id
  const userId = req.userId
  
  try {
    await coupenModal.findOneAndDelete({_id: id, user_id: userId})
    res.status(200).json({ message: "coupen deleted successfully"})
  } catch (error) {
    console.log("@delete_coupen", error);
    return res.status(500).json({ message: "something went wrong" });
  }
})

module.exports = router;
