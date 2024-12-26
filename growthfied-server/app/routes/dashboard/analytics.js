const express = require("express");
const router = express.Router();
const orderModal = require("../../models/order.modal");
const userModal = require("../../models/user.modal");
const { verifyJwtToken } = require("../../utils/auth");
const { google } = require('googleapis');
const path = require('path');
const { FRONTEND_URL } = require("../../config/index")


// Route to get summary of orders
router.get("/order-analytics", verifyJwtToken, async (req, res) => {
    const userId = req.userId
    const { start_date, end_date } = req.query; // Extract date filters from query parameters

    try {
      const dateFilter = {};
      
      // If both startDate and endDate are provided, add date range filter
      if (start_date && end_date) {
        dateFilter.order_date = {
          $gte: start_date,
          $lte: end_date,
        };
      }
  
      // Query for COD orders (cash on delivery) with date filter
      const codOrdersCount = await orderModal.countDocuments({
        store_id: userId,
        order_status: true,
        payment_method: "cod",
        ...dateFilter,
      });
  
      // Query for online orders with date filter
      const onlineOrdersCount = await orderModal.countDocuments({
        store_id: userId,
        order_status: true,
        payment_method: "online",
        online_payment_status: true,
        ...dateFilter,
      });
  
      // Query for total orders with date filter
      const totalOrdersCount = await orderModal.countDocuments({
        store_id: userId,
        order_status: true,
        ...dateFilter,
      });
  
      res.status(200).json({
        cod_orders: codOrdersCount,
        online_orders: onlineOrdersCount,
        total_orders: totalOrdersCount,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
});



router.get("/site-analytics", verifyJwtToken, async (req, res) => {
  // Path to your JSON key file
  const KEY_FILE_PATH = path.join(__dirname, './key.json');

  // Scopes for Google Analytics
  const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
  
  // Google Analytics Property ID (Replace with your actual property ID)
  const PROPERTY_ID = 'properties/470159415';

  // Get date range
  const { start_date, end_date } = req.query

  try {
    // find store
    const store = await userModal.findById(req.userId).select("username")

    // Authenticate with the Service Account
    const auth = new google.auth.GoogleAuth({
        keyFile: KEY_FILE_PATH,
        scopes: SCOPES,
    });

    // Initialize Google Analytics Data API
    const analytics = google.analyticsdata({
        version: 'v1beta',
        auth,
    });

    // get Unique Visitors, Total Visits, Total Page View, Bounce Rate
    const getBaseAnalytics = await analytics.properties.runReport({
      property: PROPERTY_ID,
      requestBody: {
         metrics: [
          { name: "activeUsers" },      // Unique Visitors
          { name: "newUsers" },        // Total Visits
          { name: "screenPageViews" }, // Total Page Views
          { name: "averageSessionDuration" } // averageSessionDuration
         ],
          dateRanges: [
            {
              startDate: start_date,
              endDate: end_date,
            },
          ],
          limit: 15,
          dimensionFilter: {
            filter: {
              fieldName: "hostname", 
              stringFilter: {
                  matchType: "EXACT",
                  value: `${store.username}.${FRONTEND_URL}`
              }
            }
          },
      },
  });

    // get top 15 referal urls

    // get top 15 products analytics
    const getTopProductsAnalytics = await analytics.properties.runReport({
        property: PROPERTY_ID,
        requestBody: {
            dimensions: [
              { name: "pageTitle" },
              { name: "pagePath" },
            ], 
            metrics: [
              { 
                name: 'screenPageViews'
              }
            ],
            dateRanges: [
              {
                startDate: start_date,
                endDate: end_date,
              },
            ],
            limit: 15,
            dimensionFilter: {
              andGroup: {
                expressions: [
                  {
                    filter: {
                      fieldName: "pagePath", 
                      stringFilter: {
                          matchType: "BEGINS_WITH",
                          value: "/product/"
                      }
                    }
                  },
                  {
                    filter: {
                      fieldName: "hostName", 
                      stringFilter: {
                          matchType: "EXACT",
                          value: `${store.username}.${FRONTEND_URL}`
                      }
                    }
                  }
                ]
            },
        },
        },
    });

    
    return res.json({
      base_analytics: getBaseAnalytics.data,
      top_products: getTopProductsAnalytics.data,
    })
} catch (error) {
  console.log("@site_analytics", error);
  return res.status(500).json({ message: "something went wrong" });
}
})
  
module.exports = router;