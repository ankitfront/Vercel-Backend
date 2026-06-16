import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/ProductModels.js";
import fs from "fs"; // ✅ for cleanup

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      isBestSeller,
    } = req.body;

    console.log("RAW BODY:", req.body); // ✅ debug

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // ✅ cleaner filter
    const images = [image1, image2, image3, image4].filter(Boolean);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        // ✅ prevent temp file buildup
        fs.unlinkSync(item.path);

        return result.secure_url;
      }),
    );

    // ✅ FIX 1: robust boolean parsing
    const isBestSellerParsed =
      typeof isBestSeller === "string"
        ? isBestSeller.toLowerCase() === "true"
        : Boolean(isBestSeller);

    // ✅ FIX 2: safe sizes parsing
    let parsedSizes = [];
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes || [];
    } catch {
      parsedSizes = [];
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: parsedSizes,
      isBestSeller: isBestSellerParsed, // ✅ fixed
      image: imagesUrl,
      date: Date.now(),
    };

    console.log("FINAL DATA:", productData); // ✅ debug

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.log("REAL ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: "Failed to list products" });
  }
};

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "product Removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove product" });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: "Failed to get product" });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
