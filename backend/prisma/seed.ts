import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Almond" },
      { name: "Coffin" },
      { name: "Square" },
      { name: "Round" },
      { name: "Oval" },
      { name: "Stiletto" },
      { name: "Squoval" },
      { name: "Flare (Duck Nails)" },
      { name: "Lipstick" },
      { name: "Edge" },
    ],
  });

  console.log("✅ Nail shape categories added!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });