import express, { NextFunction, Request, Response } from "express";
import {getStatisticsData} from "../routes/statisticRoute";
import {getBarChartData} from "../routes/barchartRoute";
import {getPieChartData} from "../routes/piechartRoute";

const router = express.Router();

/**
 * Combined Dashboard API
 */
router.get("/combined", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { month } = req.query;

    if (!month || typeof month !== 'string') {
      res.status(400).json({ error: "Month parameter is required and must be a string" });
      return;
    }

    const [statistics, barChart, pieChart] = await Promise.all([
        getStatisticsData(month),
        getBarChartData(month),
        getPieChartData(month),
      ]);
    // Combine responses from respective route logic
    res.status(200).json({
        statistics,
        barChart,
        pieChart,
      });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;
