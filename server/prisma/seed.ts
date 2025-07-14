import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData() {
  // Delete child records before parent records
  await prisma.expenseByCategory.deleteMany();
  await prisma.expenses.deleteMany();
  await prisma.sales.deleteMany();
  await prisma.salesSummary.deleteMany();
  await prisma.purchases.deleteMany();
  await prisma.purchaseSummary.deleteMany();
  await prisma.users.deleteMany();
  await prisma.products.deleteMany();
  await prisma.expenseSummary.deleteMany();

  console.log("✅ All data cleared in correct order.");
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "expenseSummary.json",
    "products.json",
    "users.json",
    "purchases.json",
    "purchaseSummary.json",
    "sales.json",
    "salesSummary.json",
    "expenses.json",
    "expenseByCategory.json",
  ];

  await deleteAllData();

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      continue;
    }

    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    if (!model) {
      console.error(`❌ No Prisma model matches the file name: ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({ data });
    }

    console.log(`✅ Seeded ${modelName} with data from ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error in seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });