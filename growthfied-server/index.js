const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path')

const app = express();

// import routes
const authRoute = require("./app/routes/auth/auth");
const onBoardingRoute = require("./app/routes/onboarding/onboarding");

const dashboardCommonRoute = require("./app/routes/dashboard/common");
const dashboardSettingsRoute = require("./app/routes/dashboard/settings");
const dashboardProductsRoute = require("./app/routes/dashboard/products");
const dashboardCategoriesRoute = require("./app/routes/dashboard/categories");
const dashboardCoupensRoute = require("./app/routes/dashboard/coupens");
const dashboardOrdersRoute = require("./app/routes/dashboard/orders");
const dashboardPagesRoute = require("./app/routes/dashboard/page");
const dashboardAnalyticsRoute = require("./app/routes/dashboard/analytics");

const storeCommonRoute = require("./app/routes/store/common");
const storeProductsRoute = require("./app/routes/store/product");
const storeCategoriesRoute = require("./app/routes/store/categories");
const storeOrdersRoute = require("./app/routes/store/order");
const storePagesRoute = require("./app/routes/store/page");

// middlewares
app.use(cors({}));
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use('/public', express.static(path.join(__dirname, 'public')))
// app.set('trust proxy', true)
dotenv.config()

app.use("/auth", authRoute)
app.use("/onboarding", onBoardingRoute)
app.use("/dashboard/common", dashboardCommonRoute)
app.use("/dashboard/settings", dashboardSettingsRoute)
app.use("/dashboard/products", dashboardProductsRoute)
app.use("/dashboard/categories", dashboardCategoriesRoute)
app.use("/dashboard/coupens", dashboardCoupensRoute)
app.use("/dashboard/orders", dashboardOrdersRoute)
app.use("/dashboard/pages", dashboardPagesRoute)
app.use("/dashboard/analytics", dashboardAnalyticsRoute)

app.use("/store/common", storeCommonRoute)
app.use("/store/products", storeProductsRoute)
app.use("/store/categories", storeCategoriesRoute)
app.use("/store/orders", storeOrdersRoute)
app.use("/store/pages", storePagesRoute)

// mongodb connection & start the server 

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("db connection & server running successful", process.pid)
    });
}).catch((err) => {
    console.log(err);
});