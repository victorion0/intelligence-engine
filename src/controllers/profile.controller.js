const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const VALID_GENDERS = ["male", "female"];
const VALID_AGE_GROUPS = ["child", "teenager", "adult", "senior"];
const VALID_SORT_FIELDS = ["age", "created_at", "gender_probability"];
const VALID_ORDERS = ["asc", "desc"];

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

    const errors = [];

    // Validate gender
    if (gender && !VALID_GENDERS.includes(gender)) {
      errors.push("Invalid gender. Must be 'male' or 'female'");
    }

    // Validate age_group
    if (age_group && !VALID_AGE_GROUPS.includes(age_group)) {
      errors.push("Invalid age_group. Must be 'child', 'teenager', 'adult', or 'senior'");
    }

    // Validate country_id (2 uppercase letters)
    if (country_id && !/^[A-Z]{2}$/.test(country_id)) {
      errors.push("Invalid country_id. Must be 2-letter ISO code (e.g., NG)");
    }

    // Validate numeric parameters
    const validateNumber = (param, name, min = 0, max = Infinity) => {
      if (param === undefined) return;
      const num = Number(param);
      if (isNaN(num) || !Number.isFinite(num)) {
        errors.push(`Invalid ${name}: must be a number`);
      } else if (num < min || num > max) {
        errors.push(`${name} must be between ${min} and ${max}`);
      }
      return num;
    };

    const minAge = validateNumber(min_age, "min_age", 0, 150);
    const maxAge = validateNumber(max_age, "max_age", 0, 150);
    validateNumber(min_gender_probability, "min_gender_probability", 0, 1);
    validateNumber(min_country_probability, "min_country_probability", 0, 1);

    // Validate sort_by
    if (sort_by && !VALID_SORT_FIELDS.includes(sort_by)) {
      errors.push(`Invalid sort_by. Must be one of: ${VALID_SORT_FIELDS.join(", ")}`);
    }

    // Validate order
    if (!VALID_ORDERS.includes(order)) {
      errors.push(`Invalid order. Must be 'asc' or 'desc'`);
    }

    // Validate page and limit
    const pageNum = validateNumber(page, "page", 1);
    let limitNum = validateNumber(limit, "limit", 1, 50);
    if (limitNum > 50) limitNum = 50; // Cap limit at 50

    if (errors.length > 0) {
      return res.status(422).json({
        status: "error",
        message: "Invalid query parameters",
        details: errors
      });
    }

    // Build where clause
    const where = {};

    if (gender) where.gender = gender;
    if (age_group) where.age_group = age_group;
    if (country_id) where.country_id = country_id;

    if (minAge !== undefined || maxAge !== undefined) {
      where.age = {};
      if (minAge !== undefined) where.age.gte = minAge;
      if (maxAge !== undefined) where.age.lte = maxAge;
    }

    if (min_gender_probability !== undefined) {
      where.gender_probability = { gte: Number(min_gender_probability) };
    }

    if (min_country_probability !== undefined) {
      where.country_probability = { gte: Number(min_country_probability) };
    }

    // Pagination
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [data, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        orderBy: sort_by ? { [sort_by]: order } : { created_at: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.profile.count({ where }),
    ]);

    res.json({
      status: "success",
      page: pageNum,
      limit: limitNum,
      total,
      data,
    });

  } catch (err) {
    console.error("Profile controller error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};
