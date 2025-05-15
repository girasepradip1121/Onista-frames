const express = require("express");
const app = express();
const sequelize = require("./Config/db");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

const index = require("./Models/index");

//import routes
const userRoutes = require("./Routes/userRoutes");
const materialRoutes = require("./Routes/materialRoutes");
const frameMaterialRoutes = require("./Routes/frameMaterialRoutes");
const sizeRoutes = require("./Routes/sizeRoutes");
const frameRoutes = require("./Routes/frameRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const newsRoutes = require("./Routes/newsRoutes");
const contactRoutes = require("./Routes/contactUsRoutes");
const sliderRoutes = require("./Routes/sliderRoutes");
const socialPostRoutes=require('./Routes/socialPostRoutes')
const wallRoutes=require('./Routes/wallRoutes')
const thicknessRoutes=require('./Routes/thicknessRoutes')
// const uploadRoutes=require('./Routes/uploadRoutes.js')
const reviewRoutes=require('./Routes/reviewRoutes.js')
const razorpayRoutes=require("./Routes/razorpayRoutes")


//routes ke use
app.use("/user", userRoutes);
app.use("/material", materialRoutes);
app.use("/framematerial", frameMaterialRoutes);
app.use("/size", sizeRoutes);
app.use("/frame", frameRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/news", newsRoutes);
app.use("/contact", contactRoutes);
app.use("/slider", sliderRoutes);
app.use("/socialpost", socialPostRoutes);
app.use("/wall", wallRoutes);
app.use("/thickness", thicknessRoutes);
// app.use("/upload",uploadRoutes)
app.use("/review",reviewRoutes)
app.use("/razorpay",razorpayRoutes)




app.get("/", (req, res) => {
  res.send("Hello, Welcome Onista");
});

sequelize
  .sync({ alter: true }) //alter:true use krna badme
  .then(() => {
    console.log("Database synced successfully...");
  })
  .catch((err) => {
    console.log("Error syncing database:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
