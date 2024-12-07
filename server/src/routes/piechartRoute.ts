import express, { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import Month from "../utils/month";

const router = express.Router();

export const getPieChartData = async (month: string) => {
  try {
    // Validate and map the month string to number using the enum
    if (!month || !((month as string) in Month)) {
      throw new Error("Invalid or missing month parameter");
    }

    const monthNumber = Month[month as keyof typeof Month];

    // Fetch all products from DB and filter them by month
    const products = await Product.find().lean();
    const filteredProducts = products.filter((product) => {
      const productMonth = new Date(product.dateOfSale).getMonth() + 1;
      return productMonth === monthNumber;
    });

    // Group by category
    const categoryCounts: Record<string, number> = {};

    filteredProducts.forEach((product) => {
      const category = product.category || "Unknown";
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });

    // Format the response
    const response = Object.keys(categoryCounts).map((category) => ({
      category,
      count: categoryCounts[category],
    }));

    return response; // Return the response data
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    throw new Error("Failed to fetch pie chart data");
  }
};

router.get(
  "/piechart",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month as string;
      const response = await getPieChartData(month); // Call the refactored data function
      res.status(200).json({
        data: response,
      });
    } catch (error) {
      console.error("Error during pie chart route", error);
      res.status(500).json({ error: "Failed to fetch pie chart data" });
    }
  }
);


export default router;