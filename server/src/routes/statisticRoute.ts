import express, { Request, Response } from "express";
import Product from "../models/product";
import Month from "../utils/month";

const router = express.Router();

router.get("/statistics", async (req: Request, res: Response): Promise<any> => {
  try {
    const { month } = req.query;

    if (!month || typeof month !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid or missing 'month' query parameter" });
    }

    // the month no from the enum
    const monthNumber = Month[month as keyof typeof Month];

    // if the month is not a valid month
    if (!monthNumber) {
      return res.status(400).json({ error: "Invalid month provided in query" });
    }
    
    // Use aggregation to calculate statistics
    const statistics = await Product.aggregate([
      {
        $addFields: {
          month: { $month: "$dateOfSale" }, // Extract month from the dateOfSale
        },
      },
      {
        $match: {
          month: monthNumber, // Match extracted month to the provided month
        },
      },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalSaleAmount: { $sum: "$price" }, // Total sales
                totalSoldItems: { $sum: 1 }, // Count all transactions
              },
            },
          ],
          notSoldCount: [
            {
              $match: { sold: false }, // Filter for not sold items
            },
            {
              $count: "count", // Count not sold items
            },
          ],
        },
      },
      {
        $project: {
          totalSaleAmount: { $arrayElemAt: ["$totals.totalSaleAmount", 0] },
          totalSoldItems: { $arrayElemAt: ["$totals.totalSoldItems", 0] },
          totalNotSoldItems: { $arrayElemAt: ["$notSoldCount.count", 0] },
        },
      },
    ]);

    // If no matching data, return zeros
    if (!statistics || statistics.length === 0) {
      res.status(200).json({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      });
      return;
    }

    const { totalSaleAmount = 0, totalSoldItems = 0, totalNotSoldItems = 0 } =
      statistics[0];

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
