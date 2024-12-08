import express from "express";
import axios from "axios";
import Month from "../utils/month";

const router = express.Router();
// second approch a/c to question as fetch data from api and combine it and send in json format
router.get("/combined2", async (req, res): Promise<void> => {
  try {
    const { month } = req.query;

    // Validate `month` parameter
    if (!month || typeof month !== "string" || !Month[month as keyof typeof Month]) {
        res.status(400).json({ error: "Invalid or missing 'month' query parameter" });
        return;
      }

    const monthName = month.toLowerCase();

     // Fetch all required data in parallel
    const urls = [
      `${process.env.URL}/api/statistics?month=${monthName}`,
      `${process.env.URL}/api/barchart?month=${monthName}`,
      `${process.env.URL}/api/piechart?month=${monthName}`,
    ];
    console.log(`Fetching data from ${urls}`)
    const [statistics, barchart, piechart] = await Promise.all(
      urls.map((url) =>
        axios.get(url).then((response) => response.data).catch((err) => {
          console.error(`Error fetching data from ${url}:`, err.message);
          console.log(`Fetching data from ${url}`)
          throw new Error(`Failed to fetch data from one or more APIs`);
        })
      )
    );


    res.status(200).json({ statistics, barchart, piechart });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;