import express, { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import Month from "../utils/month";

const router = express.Router();

// extracted logic to use into combined api
export const getStatisticsData = async (month:string) => {
  try {
    if (!month || typeof month !== "string") {
      throw new Error("Invalid or missing 'month' query parameter");
    }

    const monthNumber = Month[month as keyof typeof Month];

    if (!monthNumber) {
      throw new Error("Invalid month provided in query");
    }

    const statistics = await Product.aggregate([
      {
        $addFields: {
          month: { $month: "$dateOfSale" },
        },
      },
      {
        $match: {
          month: monthNumber,
        },
      },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalSaleAmount: { $sum: "$price" },
                totalSoldItems: { $sum: 1 },
              },
            },
          ],
          notSoldCount: [
            {
              $match: { sold: false },
            },
            {
              $count: "count",
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

    if (!statistics || statistics.length === 0) {
      return {
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      };
    }

    const { totalSaleAmount = 0, totalSoldItems = 0, totalNotSoldItems = 0 } = statistics[0];

    return {
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    };
  } catch (error) {
    console.error("Error during statistics computation:", error);
    throw new Error("Failed to fetch statistics");
  }
};

router.get("/statistics", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const month = req.query.month as string;
    const statisticsResponse = await getStatisticsData(month);
    res.status(200).json(statisticsResponse);
  } catch (error) {
    console.error("Error fetching statistics data", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;


