const express = require("express");
const router = express.Router();
const orderModal = require("../../models/order.modal");
const { verifyJwtToken } = require("../../utils/auth");

// Get orders list with filters
router.get("/get-orders", verifyJwtToken, async (req, res) => {  
    const userId = req.userId
    const {
        page_index,
        page_size,
        mobile_number,
        order_id,
        start_date,
        end_date,
        order_status
    } = req.query; // Get filter values from query

    const skip = page_index * page_size;

    // Build dynamic filter object
    let filters = {};

    // Add filters based on query parameters
    if (userId) filters.store_id = userId
    if (mobile_number) filters.mobile_number = mobile_number;
    if (order_id) filters.order_id = order_id;
    if (order_status){
        if(order_status !== "All") filters.order_last_status = order_status;
    }
    filters.order_status = true;

    // Date range filter (start date and end date)
    if (start_date && end_date) {
        filters.order_date = { $gte: start_date, $lte: end_date };
    }

    try {
        const orders = await orderModal
            .find(filters) // Apply the filters
            .sort({ createdAt: -1 }) // Sort by creation date (most recent first)
            .skip(skip)
            .limit(parseInt(page_size));

        const totalRecords = await orderModal.countDocuments(filters); // Get total count based on the filters

        res.status(200).json({ orders, totalRecords });
    } catch (error) {
        console.error("@get_orders", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

router.get("/get-order-details/:orderId", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    try {
        const order = await orderModal.findOne({ store_id: userId, _id: req.params.orderId })
        if(!order) return res.status(404).json({ message: "Order not found"})
        return res.status(200).json(order)
    } catch (error) {
        console.error("@get_order", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
})

router.post("/update-order-status/:id", verifyJwtToken, async (req, res) => {
    try {
      const userId = req.userId
      const { id } = req.params; // Extract the order ID
      const { order_progress, expected_delivery_date } = req.body || {};
      let { status, date, time } = order_progress || {};

      // Modify status if necessary
      if (status === "Shipped") status = "Item Shipped";
      if (status === "Completed") status = "Order Completed";
  
      // Build the update object dynamically
      const updateData = {};
  
      // Add order_progress only if status is not null
      if (status) {
        updateData.$push = { 
          order_progress: { status, date, time } 
        };
      }
  
      // Add expected_delivery_date only if it is not null
      if (expected_delivery_date) {
        updateData.$set = updateData.$set || {};
        updateData.$set.expected_delivery_date = expected_delivery_date;
      }
  
      // Update order_last_status only if status is provided
      if (status) {
        updateData.$set = updateData.$set || {};
        updateData.$set.order_last_status = order_progress.status;
      }
  
      // Execute the update query
      await orderModal.findOneAndUpdate(
        { _id: id, store_id: userId },
        updateData
      );
  
      res.status(200).json({ message: "Order status updated successfully!" });
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });

router.post("/enable-tracking-link/:id", verifyJwtToken, async (req, res) => {
  try {
      const userId = req.userId
      const { url } = req.body; // Extract the tracking URL from the request body
  
      // Validate the input URL
      if (!url) {
        return res.status(400).json({ message: "Invalid tracking URL provided." });
      }
  
      // Execute the update query
      await orderModal.findOneAndUpdate(
        { _id: req.params.id, store_id: userId }, // Match the order by ID
        {
          $set: {
            "custom_tracking_url.applied": true,
            "custom_tracking_url.url": url,
          },
        },
        { new: true } // Return the updated document
      );
  
      res.status(200).json({
        message: "Tracking link enabled successfully!"
      });

    } catch (error) {
      console.error("Error enabling tracking link:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });

router.post("/disable-tracking-link/:id", verifyJwtToken, async (req, res) => {
    try {
      const userId = req.userId
      // Execute the update query
      await orderModal.findOneAndUpdate(
        { _id: req.params.id, store_id: userId }, // Match the order by ID
        {
          $set: {
            "custom_tracking_url.applied": false,
            "custom_tracking_url.url": "",
          },
        },
        { new: true } // Return the updated document
      );
  
      res.status(200).json({
        message: "Tracking link enabled successfully!"
      });

    } catch (error) {
      console.error("Error enabling tracking link:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  router.post("/cancel-order/:id", verifyJwtToken, async (req, res) => {
    try {
      const userId = req.userId
      const { id } = req.params; // Extract `id` from route parameters
      const { date, time } = req.body || {};
  
      const updateData = {
        $push: {
          order_progress: { status: "Order Cancelled", date, time },
        },
        $set: {
          order_last_status: "Cancelled",
          is_order_cancelled: true,
        },
      };
  
      // Execute the update query
      await orderModal.findOneAndUpdate(
        { _id: id, store_id: userId },
        updateData,
        { new: true }
      );
  
      res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
      console.log("@cancel_order error for ID:", req.params.id, error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });

  router.post("/re-open-order/:id", verifyJwtToken, async (req, res) => {
    try {
      const userId = req.userId
      const { id } = req.params; // Extract `id` from route parameters
      const { date, time } = req.body || {};
  
      const updateData = {
        $push: {
          order_progress: { status: "Order Re-Opened", date, time },
        },
        $set: {
          order_last_status: "Re-Opened",
          is_order_cancelled: false,
        },
      };
  
      // Execute the update query
      await orderModal.findOneAndUpdate(
        { _id: id, store_id: userId },
        updateData,
        { new: true }
      );
  
      res.status(200).json({ message: "Order re-opened successfully" });
    } catch (error) {
      console.log("@re_open_order error for ID:", req.params.id, error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });
  


module.exports = router;
