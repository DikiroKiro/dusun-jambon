const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  const officials = await prisma.official.findMany({
    where: { aktif: true },
    orderBy: { urutan: "asc" }
  });
  console.log('=== Officials ===');
  console.log(JSON.stringify(officials, null, 2));

  const dusun = await prisma.dusun.findMany({
    orderBy: { urutan: "asc" }
  });
  console.log('=== Dusun ===');
  console.log(JSON.stringify(dusun, null, 2));

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});