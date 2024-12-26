const express = require("express");
const router = express.Router();
const productModal = require("../../models/product.modal");
const categoryModal = require("../../models/category.modal");
const userModal = require("../../models/user.modal");

router.get("/get-all-categories/:store_name", async (req, res) => {
    try {
        const store = await userModal.findOne({ username: req.params.store_name }, { _id: 1 })
        if(store === null) return res.status(404).json({ message: "sorry, this store not found!" })
        const categories = await categoryModal.find({ user_id: store._id, status: "Active" }).sort({ createdAt: -1 }).select("-user_id")
        return res.status(200).json(categories);
    } catch (error) {
        console.log("@get_all_categories", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.get("/get-category-name/:id", async (req, res) => {
    try {
        const category = await categoryModal.findOne({ _id: req.params.id }).select("category_name")
        return res.status(200).json({ category_name: category.category_name });
    } catch (error) {
        console.log("@get_category_name",error)
        return res.status(500).json({ message: "something went wrong"})
    }
})

router.get("/get-products-by-category/:store_name/:category_id", async (req, res) => {
    try {
        const store = await userModal.findOne({ username: req.params?.store_name }, { _id: 1 })
        const products = await productModal.find({
            user_id: store?._id,
            status: "Active",
            categories: { $in: req.params.category_id }
        }).select("title images selling_price original_price slug")

        return res.status(200).json(products);

    } catch (error) {
        console.log("@get-single-product", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 


module.exports = router