import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        title: 'Test Nail Set',
        description: 'Beautiful press-on nails',
        price: 19.99,
        image: 'https://example.com/nailset.jpg',
      },
      {
        title: 'New Nail Set',
        description: 'A stylish new set',
        price: 29.99,
        image: 'https://example.com/newset.jpg',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });