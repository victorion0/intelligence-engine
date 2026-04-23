const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const raw = require("./data.json");

// your file shape: { profiles: [...] }
const data = raw.profiles;

async function main() {
  console.log("🌱 Seeding started...");
  console.log("Total records:", data.length);

  await prisma.profile.createMany({
    data,
    skipDuplicates: true,
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });