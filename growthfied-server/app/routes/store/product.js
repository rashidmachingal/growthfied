const express = require("express");
const router = express.Router();
const productModal = require("../../models/product.modal");
const userModal = require("../../models/user.modal");

router.get("/get-all-products/:store_name", async (req, res) => {
    try {
        const store = await userModal.findOne({ username: req.params.store_name }, { _id: 1 })
        if(store === null) return res.status(404).json({ message: "sorry, this store not found!" })
        const products = await productModal.find({ user_id: store._id, status: "Active" }).sort({ createdAt: -1 }).
        select("title images selling_price original_price slug")
        return res.status(200).json(products);
    } catch (error) {
        console.log("@get_all_products", error)
        return res.status(500).json({ message: "something went wrong" })
    }
})

router.get("/search-products/:store_name/:query", async (req, res) => {
    try {
        const searchQuery = new RegExp(req.params.query,'i');
        const store = await userModal.findOne({ username: req.params.store_name }, { _id: 1 })
        if(store === null) return res.status(404).json({ message: "sorry, this store not found!", status: "ok" })
        const products = await productModal.find({ user_id: store._id, title: searchQuery, status: "Active" }).sort({ createdAt: -1 }).
        select("title images selling_price original_price slug")
        return res.status(200).json(products);
    } catch (error) {
        console.log("@get_search_products", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 

router.get("/get-single-product/:store_name/:slug", async (req, res) => {
    try {
        const store = await userModal.findOne({ username: req.params?.store_name }, { _id: 1 })
        const product = await productModal.findOne({ user_id: store?._id, slug: req.params?.slug ,status: "Active" })

        if(product === null){
            return res.status(404).json({ message: "sorry, this product not found!"})
        }else{
            return res.status(200).json(product);
        }

    } catch (error) {
        console.log("@get-single-product", error)
        return res.status(500).json({ message: "something went wrong" })
    }
}) 


module.exports = router