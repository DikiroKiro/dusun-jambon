const { PrismaClient } = require('./node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update jamLayanan kembali Senin-Jumat
  await prisma.siteConfig.update({
    where: { id: 1 },
    data: { jamLayanan: 'Senin – Jumat, 08.00 – 14.00 WIB' }
  });
  console.log('✅ jamLayanan updated to: Senin – Jumat, 08.00 – 14.00 WIB');

  const updated = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  console.log('📝 Isi jamLayanan:', updated.jamLayanan);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('❌ Gagal:', e.message);
  process.exit(1);
});