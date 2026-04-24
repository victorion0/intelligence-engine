const { PrismaClient } = require("@prisma/client");
const { v7: uuidv7 } = require("uuid");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, "seed", "data.json");
  const rawData = fs.readFileSync(dataPath, "utf8");
  const { profiles } = JSON.parse(rawData);

  console.log(`Seeding ${profiles.length} profiles...`);

  // Get existing profile names to avoid duplicates
  const existingProfiles = await prisma.profile.findMany({
    select: { name: true }
  });
  const existingNames = new Set(existingProfiles.map(p => p.name));

  // Filter out existing profiles
  const newProfiles = profiles.filter(p => !existingNames.has(p.name));

  if (newProfiles.length === 0) {
    console.log("All profiles already exist. No new records to seed.");
    return;
  }

  console.log(`Inserting ${newProfiles.length} new profiles...`);

  // Prepare data with UUID v7
  const profilesToInsert = newProfiles.map(profile => ({
    id: uuidv7(),
    name: profile.name,
    gender: profile.gender,
    gender_probability: profile.gender_probability,
    age: profile.age,
    age_group: profile.age_group,
    country_id: profile.country_id,
    country_name: profile.country_name,
    country_probability: profile.country_probability,
  }));

  // Batch insert using createMany with skipDuplicates
  const result = await prisma.profile.createMany({
    data: profilesToInsert,
    skipDuplicates: true,
  });

  console.log(`Successfully seeded ${result.count} new profiles.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
