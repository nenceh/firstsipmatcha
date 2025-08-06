import { PrismaClient } from "@prisma/client";
import { menuFull } from './menuFull';

const prisma = new PrismaClient();

async function main() {
  for (const cat of menuFull){
    const { ...catData } = cat;

    await prisma.category.create({
      data: {
        id: catData.id.toString(),
        name: catData.name,
        description: catData.description,
        list: {
          create: catData.list.map((item) => { return { ...item } })
        },
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });