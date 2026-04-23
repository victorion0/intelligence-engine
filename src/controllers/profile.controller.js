const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getProfiles = async (req, res) => {
  try {
    const {
      gender,
      age_group,
      country_id,
      min_age,
      max_age,
      min_gender_probability,
      min_country_probability,
      sort_by,
      order = "asc",
      page = 1,
      limit = 10
    } = req.query;

    const where = {};

    // FILTERS
    if (gender) where.gender = gender;
    if (age_group) where.age_group = age_group;
    if (country_id) where.country_id = country_id;

    if (min_age || max_age) {
      where.age = {};
      if (min_age) where.age.gte = Number(min_age);
      if (max_age) where.age.lte = Number(max_age);
    }

    if (min_gender_probability) {
      where.gender_probability = { gte: Number(min_gender_probability) };
    }

    if (min_country_probability) {
      where.country_probability = { gte: Number(min_country_probability) };
    }

    // PAGINATION
    const skip = (page - 1) * limit;

    // QUERY DB
    const [data, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        orderBy: sort_by ? { [sort_by]: order } : undefined,
        skip: Number(skip),
        take: Number(limit),
      }),
      prisma.profile.count({ where }),
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