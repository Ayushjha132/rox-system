import express from "express";
import axios from "axios";
import Product from "../models/product";

const router = express.Router();

router.get("/seedData", async (req, res) => {
  try {
    // Fetch data from the third-party API s3 json file
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = response.data;

    // Seed data into the database
    for (const product of products) {
      await Product.updateOne(
        { id: product.id }, // Check if the product already exists
        {
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          sold: product.sold,
          dateOfSale: product.dateOfSale,
        },
        { upsert: true } // Insert if it doesn't exist
      );
    }

    res
      .status(200)
      .json({ message: "Database initialized with seed data successfully!" });
      console.log("Database initialized with seed data successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ error: "Failed to initialize database" });
  }
});

export default router;
