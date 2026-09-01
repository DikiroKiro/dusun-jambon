const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update Ketua RT 04 from Pak Miyanto to Pak Sirom
  const result = await prisma.official.update({
    where: { id: "cmshune0j0005wn2u0xygmk6x" }, // urutan 6 = Ketua RT 04
    data: { nama: 'Pak Sirom' }
  });
  console.log('✅ Updated Official:', result);

  // Verify all officials
  const officials = await prisma.official.findMany({
    where: { aktif: true },
    orderBy: { urutan: "asc" }
  });
  console.log('\n=== All Officials ===');
  officials.forEach(o => {
    console.log(`${o.urutan}. ${o.nama} - ${o.jabatan}`);
  });

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});