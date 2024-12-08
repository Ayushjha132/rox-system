import express from "express";
import Product from "../models/product";
import Month from "../utils/month";

const router = express.Router();

// GET api/transactions route
router.get("/transactions", async (req, res):Promise<any> => {
  try {
    const { search = "", page = "1", perPage = "10", month } = req.query;
    // month param
    if (!month || typeof month !== "string" || !Month[month as keyof typeof Month]) {
      return res.status(400).json({ error: "Invalid or missing 'month' query parameter" });
    }
    const monthNumber = Month[month as keyof typeof Month];
    
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

    // Fetch all products from DB and apply filters
    const products = await Product.find(searchFilter).lean();

    // Filter by month 
    const filteredProducts = products.filter((product) => {
      const productMonth = new Date(product.dateOfSale).getMonth() + 1;
      return productMonth === monthNumber;
    });

    // Paginate the filtered results
    const totalRecords = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(skip, skip + limit);

    // Return the result
    res.status(200).json({
      currentPage,
      perPage: limit,
      totalRecords,
      transactions: paginatedProducts,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default router;
