exports.parseQuery = (q) => {
  const query = q.toLowerCase();

  const filters = {};

  // gender
  if (query.includes("male")) filters.gender = "male";
  if (query.includes("female")) filters.gender = "female";

  // age rules
  if (query.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  if (query.includes("above 30")) {
    filters.min_age = 30;
  }

  // age groups
  if (query.includes("teenager")) filters.age_group = "teenager";
  if (query.includes("adult")) filters.age_group = "adult";
  if (query.includes("senior")) filters.age_group = "senior";

  // countries
  const countries = {
    nigeria: "NG",
    kenya: "KE",
    uganda: "UG",
    sudan: "SD",
    tanzania: "TZ",
    angola: "AO",
  };

  for (let key in countries) {
    if (query.includes(key)) {
      filters.country_id = countries[key];
    }
  }

  return Object.keys(filters).length ? filters : null;
};