import express from "express";
import Product from "../models/product";

const router = express.Router();

// GET api/transactions route
router.get("/transactions", async (req, res) => {
  try {
    const { search = "", page = "1", perPage = "10" } = req.query;
    // setup pagination value
    const currentPage = parseInt(page as string, 10) || 1;
    const limit = parseInt(perPage as string, 10) || 10;
    const skip = (currentPage - 1) * limit;

    // search filter for query (if any param)
    const searchConditions = [];

    if (search) {
      // Add partial match for title
      searchConditions.push({
        // this find any occurances of search value in title it will be return
        title: { $regex: `.*${search}.*`, $options: "i" },
      });
      // Add partial match for description
      searchConditions.push({
        description: { $regex: `.*${search}.*`, $options: "i" },
      });

      // Check if search can be a number for price
      if (!isNaN(Number(search))) {
        searchConditions.push({ price: Number(search) });
      }
    }

    const searchFilter =
      searchConditions.length > 0 ? { $or: searchConditions } : {};

    // Fetch transactions with pagination
    const transactions = await Product.find(searchFilter)
      .skip(skip)
      .limit(limit);

    // total matching
    const totalCount = await Product.countDocuments(searchFilter);

    // return the result
    res.status(200).json({
      currentPage,
      perPage: limit,
      totalRecords: totalCount,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default router;
