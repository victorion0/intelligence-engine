const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { parseQuery } = require("../utils/nlp");

exports.searchProfiles = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Missing query"
      });
    }

    const filters = parseQuery(q);

    if (!filters) {
      return res.status(422).json({
        status: "error",
        message: "Unable to interpret query"
      });
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.profile.findMany({
        where: filters,
        skip: Number(skip),
        take: Number(limit),
      }),
      prisma.profile.count({ where: filters }),
    ]);

    res.json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      total,
      data,
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};