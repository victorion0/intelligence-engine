exports.parseQuery = (q) => {
  const query = q.toLowerCase().trim();
  const filters = {};

  // 1. Gender parsing (handle both male and female)
  const hasMale = query.includes("male") || query.includes("men") || query.includes("boys");
  const hasFemale = query.includes("female") || query.includes("women") || query.includes("girls");
  
  if (hasMale && !hasFemale) {
    filters.gender = "male";
  } else if (hasFemale && !hasMale) {
    filters.gender = "female";
  }
  // If both or neither: no gender filter

  // 2. Age group parsing
  if (query.includes("child")) filters.age_group = "child";
  if (query.includes("teenager") || query.includes("teenagers") || query.includes("teens")) {
    filters.age_group = "teenager";
  }
  if (query.includes("adult") || query.includes("adults")) filters.age_group = "adult";
  if (query.includes("senior") || query.includes("seniors") || query.includes("elderly")) {
    filters.age_group = "senior";
  }

  // 3. Age range parsing
  // Young: 16-24
  if (query.includes("young")) {
    filters.min_age = 16;
    filters.max_age = 24;
  }

  // Above/Over X: min_age = X
  const aboveMatch = query.match(/above\s+(\d+)|over\s+(\d+)/);
  if (aboveMatch) {
    const age = Number(aboveMatch[1] || aboveMatch[2]);
    if (!isNaN(age)) {
      filters.min_age = age;
    }
  }

  // Below/Under X: max_age = X
  const belowMatch = query.match(/below\s+(\d+)|under\s+(\d+)/);
  if (belowMatch) {
    const age = Number(belowMatch[1] || belowMatch[2]);
    if (!isNaN(age)) {
      filters.max_age = age;
    }
  }

  // Between X and Y: min_age=X, max_age=Y
  const betweenMatch = query.match(/between\s+(\d+)\s+and\s+(\d+)/);
  if (betweenMatch) {
    const min = Number(betweenMatch[1]);
    const max = Number(betweenMatch[2]);
    if (!isNaN(min) && !isNaN(max)) {
      filters.min_age = min;
      filters.max_age = max;
    }
  }

  // 4. Country parsing
  const countryMap = {
    nigeria: "NG", "south africa": "ZA", kenya: "KE", uganda: "UG",
    sudan: "SD", tanzania: "TZ", angola: "AO", ghana: "GH", ethiopia: "ET",
    egypt: "EG", morocco: "MA", "cote d'ivoire": "CI", senegal: "SN",
    cameroon: "CM", benin: "BJ", togo: "TG", mali: "ML", niger: "NE"
  };

  for (const [name, code] of Object.entries(countryMap)) {
    if (query.includes(name)) {
      filters.country_id = code;
      break; // Take first matching country
    }
  }

  // Return filters if any, else null
  return Object.keys(filters).length > 0 ? filters : null;
};
