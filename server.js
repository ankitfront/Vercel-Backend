import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoute.js";

//app config

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(cors());
app.use(express.json());

//api endpoints
app.use("/api/user",userRouter);
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use('/api/order',orderRoutes)



app.get("/", (req, res) => {
    res.status(200).send("Hello World");
})
app.listen(port, ()=> console.log(`Server is running on port ${port}`));