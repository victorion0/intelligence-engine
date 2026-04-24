const { PrismaClient } = require("@prisma/client");
let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  prisma = null;
}
const { parseQuery } = require("../utils/nlp");

exports.searchProfiles = async (req, res) => {
   if (!prisma) {
     return res.status(500).json({
       status: "error",
       message: "Database connection failed"
     });
   }
   try {
     const { q, page = 1, limit = 10 } = req.query;

    // Validate query parameter
    if (!q || q.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty query parameter"
      });
    }

    // Validate and parse pagination
    const pageNum = Number(page);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(422).json({
        status: "error",
        message: "Invalid query parameters"
      });
    }

    let limitNum = Number(limit);
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(422).json({
        status: "error",
        message: "Invalid query parameters"
      });
    }
    if (limitNum > 50) limitNum = 50; // Cap limit at 50

    // Parse natural language query
    const filters = parseQuery(q);
    if (!filters) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [data, total] = await Promise.all([
      prisma.profile.findMany({
        where: filters,
        orderBy: { created_at: "desc" }, // Default sort for search
        skip,
        take: limitNum,
      }),
      prisma.profile.count({ where: filters }),
    ]);

    res.json({
      status: "success",
      page: pageNum,
      limit: limitNum,
      total,
      data,
    });

  } catch (err) {
    console.error("Search controller error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};
