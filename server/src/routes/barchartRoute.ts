import express, { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import Month from "../utils/month";

const router = express.Router();

export const getBarChartData = async (month: string) => {
  try {
    // Validate and map the month string to the corresponding enum value
    if (!month || !((month as string) in Month)) {
      throw new Error("Invalid or missing month parameter");
    }
    const monthNumber = Month[month as keyof typeof Month]; // Map month name to number

    // Fetch products for the given month
    const products = await Product.find().lean();

    // Filter by the given month
    const filteredProducts = products.filter((product) => {
      const productMonth = new Date(product.dateOfSale).getMonth() + 1;
      return productMonth === monthNumber;
    });

    // Initialize price range buckets
    const priceRanges = [
      { range: "0-100", min: 0, max: 100, count: 0 },
      { range: "101-200", min: 101, max: 200, count: 0 },
      { range: "201-300", min: 201, max: 300, count: 0 },
      { range: "301-400", min: 301, max: 400, count: 0 },
      { range: "401-500", min: 401, max: 500, count: 0 },
      { range: "501-600", min: 501, max: 600, count: 0 },
      { range: "601-700", min: 601, max: 700, count: 0 },
      { range: "701-800", min: 701, max: 800, count: 0 },
      { range: "801-900", min: 801, max: 900, count: 0 },
      { range: "901-above", min: 901, max: Infinity, count: 0 },
    ];

    // Populate price range counts
    filteredProducts.forEach((product) => {
      const price = product.price;
      for (const range of priceRanges) {
        if (price >= range.min && price <= range.max) {
          range.count++;
          break;
        }
      }
    });

    // Format the response
    const response = priceRanges.map((range) => ({
      range: range.range,
      count: range.count,
    }));

    return response;
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    throw new Error("Failed to fetch bar chart data");
  }
};

router.get(
  "/barchart",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const month = req.query.month as string;

      const barChartResponse = await getBarChartData(month);
      res.status(200).json({
        data: barChartResponse,
      });
    } catch (error) {
      console.error("Error fetching bar chart data", error);
      res.status(500).json({ error: "Failed to fetch bar chart data" });
    }
  }
);

export default router;
