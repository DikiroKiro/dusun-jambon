import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding data contoh Desa Jambon...");

  // ---- SiteConfig (single row id=1) ----
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      namaDesa: "Padukuhan Jambon",
      kecamatan: "Gedangsari",
      kabupaten: "Gunungkidul",
      provinsi: "DI Yogyakarta",
      alamatKantor:
        "Jambon, Hargomulyo, Gedangsari, Gunungkidul, DI Yogyakarta 55863",
      noWhatsApp: "6289529386144", // 0895-2948-6144
      emailDesa: null,
      jamLayanan: "Senin - Jumat, 08.00 - 14.00 WIB",
      mapsEmbedUrl:
        "https://maps.google.com/maps?q=Jambon,+Hargomulyo,+Gedangsari,+Gunungkidul,+DI+Yogyakarta&t=&z=15&ie=UTF8&iwloc=&output=embed",
      visi: "Mewujudkan Padukuhan Jambon yang mandiri, berbudaya, dan sejahtera melalui pemberdayaan potensi lokal, UMKM, serta kelestarian alam berlandaskan semangat gotong royong.",
      misi: [
        "Menghadirkan solusi inovatif dan berkualitas tinggi yang secara konsisten melampaui harapan",
        "Memberdayakan komunitas melalui kolaborasi yang berkelanjutan",
        "Menciptakan dampak positif yang nyata demi masa depan yang lebih baik",
      ].join("\n"),
      sejarah:
        "Padukuhan Jambon merupakan salah satu padukuhan di Desa Hargomulyo, Kecamatan Gedangsari, Kabupaten Gunungkidul. Masyarakatnya mayoritas bermata pencaharian di sektor pertanian dan peternakan, dengan semangat gotong royong yang masih kuat.",
      heroFoto: "hero/hero-desa-jambon.webp",
    },
  });

  // ---- Official (struktur) ----
  const officials = [
    { nama: "Ibu Sumiyati", jabatan: "Dukuh Jambon", foto: "struktur/Sumiyati.png", urutan: 1 },
    { nama: "Pak Mujiyo", jabatan: "Ketua RW 009", foto: null, urutan: 2 },
    { nama: "Pak Suwito Arjo", jabatan: "Ketua RT 01", foto: null, urutan: 3 },
    { nama: "Pak Sarno", jabatan: "Ketua RT 02", foto: null, urutan: 4 },
    { nama: "Pak Pardiyono", jabatan: "Ketua RT 03", foto: null, urutan: 5 },
    { nama: "Pak Miyanto", jabatan: "Ketua RT 04", foto: null, urutan: 6 },
    { nama: "Sumiyati", jabatan: "Ketua Sub PPKBD", foto: "struktur/Sumiyati.png", urutan: 7 },
    { nama: "Sumarni", jabatan: "Sub PPKBD RT 01", foto: "struktur/Sumarni.png", urutan: 8 },
    { nama: "Mufidah", jabatan: "Sub PPKBD RT 02", foto: "struktur/Mufidah.png", urutan: 9 },
    { nama: "Septi", jabatan: "Sub PPKBD RT 03", foto: "struktur/Septi.png", urutan: 10 },
    { nama: "Nuning", jabatan: "Sub PPKBD RT 04", foto: "struktur/Nuning.png", urutan: 11 },
    { nama: "Sumiyati", jabatan: "Ketua Posyandu Sindoro", foto: "struktur/Sumiyati.png", urutan: 12 },
    { nama: "Paini", jabatan: "Sekretaris Posyandu Sindoro", foto: "struktur/Paini.png", urutan: 13 },
    { nama: "Sukinem", jabatan: "Bendahara Posyandu Sindoro", foto: "struktur/Sukinem.png", urutan: 14 },
    { nama: "Jumini", jabatan: "Anggota Posyandu Sindoro", foto: "struktur/Jumini.png", urutan: 15 },
    { nama: "Wagini", jabatan: "Anggota Posyandu Sindoro", foto: "struktur/Wagini.png", urutan: 16 },
  ];
  for (const o of officials) {
    await prisma.official.create({ data: o });
  }

  // ---- Statistik ----
  const statistik = [
    { label: "Penduduk", nilai: "421", tahun: "2026", urutan: 1 },
    { label: "Kartu Keluarga", nilai: "128", tahun: "2026", urutan: 2 }, // DUMMY
    { label: "RT", nilai: "4", tahun: "2026", urutan: 3 },
    { label: "RW", nilai: "1", tahun: "2026", urutan: 4 },
  ];
  for (const s of statistik) {
    await prisma.statistik.create({ data: s });
  }

  // ---- UMKM ----
  const umkm = [
    {
      nama: "Kripik Pisang",
      pemilik: "Kelompok Wanita Tani",
      deskripsi:
        "Camilan keripik pisang tradisional yang renyah dengan cita rasa autentik. Diolah langsung dari pisang lokal segar oleh tangan-tangan terampil Kelompok Wanita Tani.",
      noWhatsApp: "6289529386144",
      alamat: "Jambon, Hargomulyo, Gedangsari",
      foto: "umkm/KeripikPisang.jpeg",
      aktif: true,
    },
    {
      nama: "Bubuk Jahe Instant",
      pemilik: "Kelompok Wanita Tani",
      deskripsi:
        "Minuman serbuk jahe praktis hasil olahan pemberdayaan Kelompok Wanita Tani. Dibuat dari rimpang jahe pilihan dan gula murni untuk memberikan kehangatan alami serta membantu menjaga stamina tubuh.",
      noWhatsApp: "6289529386144",
      alamat: "Jambon, Hargomulyo, Gedangsari",
      foto: "umkm/BubukJahe.png",
      aktif: true,
    },
  ];
  for (const u of umkm) {
    await prisma.umkm.create({ data: u });
  }

  // ---- Galeri: 1 album ----
  const album = await prisma.album.create({
    data: {
      judul: "Layanan Administrasi Kependudukan",
      slug: "layanan-administrasi-kependudukan",
      deskripsi: "Informasi persyaratan layanan administrasi kependudukan.",
      tanggal: new Date("2026-07-01T00:00:00Z"),
      photos: {
        create: [
          { path: "galeri/kk.webp", caption: "Persyaratan Kartu Keluarga", urutan: 1 },
          { path: "galeri/ektp.webp", caption: "Persyaratan E-KTP", urutan: 2 },
          { path: "galeri/akta.webp", caption: "Persyaratan Akta Kelahiran", urutan: 3 },
          { path: "galeri/aktamati.webp", caption: "Persyaratan Akta Kematian", urutan: 4 },
          { path: "galeri/domisili.webp", caption: "Persyaratan Surat Domisili", urutan: 5 },
        ],
      },
    },
  });
  console.log("Album:", album.slug);

  // ---- KbEntry (KB chatbot: SURAT riil + dummy untuk PROGRAM/POSYANDU/KONTAK) ----
  const kb = [
    {
      kategori: "SURAT",
      judul: "Persyaratan Penerbitan Kartu Keluarga (KK)",
      isi: "1. Membentuk keluarga baru (setelah menikah): Buku Nikah/Kutipan Akta Perkawinan atau Akta Perceraian (asli); KTP-el suami dan istri.\n2. Pisah Kartu Keluarga: KK lama.\n3. Penggantian kepala keluarga (karena meninggal): Akta Kematian; KK lama.\n4. KK hilang: Surat Keterangan Kehilangan dari Kepolisian; KTP-el.\n5. KK rusak: KK yang rusak; KTP-el.\n6. Perubahan biodata pada KK: KK lama; dokumen pendukung sesuai perubahan (Ijazah, Akta Kelahiran, Akta Nikah/Akta Cerai, Akta Kematian, atau surat keterangan lain).\n\nBiaya: GRATIS. Cara pengajuan: datang langsung ke kantor Disdukcapil setempat atau layanan online jika tersedia.",
    },
    {
      kategori: "SURAT",
      judul: "Persyaratan Pembuatan KTP Elektronik",
      isi: "1. Berusia 17 tahun atau sudah/pernah menikah.\n2. Fotokopi KK yang masih berlaku.\n3. Mengisi formulir permohonan Disdukcapil bila diperlukan.\n4. Perekaman biometrik (foto wajah, sidik jari, iris mata, tanda tangan elektronik).\n5. Datang langsung ke kantor Disdukcapil (tidak dapat diwakilkan).\n\nKTP hilang: Surat Keterangan Kehilangan dari Kepolisian + fotokopi KK.\nKTP rusak: KTP rusak + fotokopi KK.\nBiaya: GRATIS.",
    },
    {
      kategori: "SURAT",
      judul: "Persyaratan Pembuatan Akta Kelahiran",
      isi: "Bayi belum punya NIK/KK: Surat Keterangan Kelahiran dari RS/puskesmas/bidan/penolong (tertulis nama bayi); Surat Nikah orang tua (jika menikah); KK; KTP-el ayah dan ibu.\n\nSudah punya NIK: Surat Keterangan Kelahiran (atau SPTJM Kebenaran Data Kelahiran jika tidak ada); Surat Nikah orang tua (atau SPTJM Kebenaran sebagai Pasangan Suami Istri jika tidak ada akta nikah); KK; KTP-el orang tua atau pemohon.\n\nBiaya: GRATIS. SPTJM dibuat jika dokumen tidak tersedia; data diverifikasi petugas.",
    },
    {
      kategori: "SURAT",
      judul: "Persyaratan Pembuatan Akta Kematian",
      isi: "1. Surat Keterangan Kematian asli dari RS/puskesmas/faskes.\n2. KTP-el almarhum.\n3. KK almarhum.\n4. KTP-el pelapor.\n5. KTP-el 2 orang saksi.\n6. Surat Tugas jika dilaporkan petugas RS/faskes mitra.\n\nPelaporan maksimal 2x24 jam sejak meninggal. Setelah diverifikasi Disdukcapil, Akta Kematian dan KK yang diperbarui diambil di Kantor Disdukcapil.",
    },
    {
      kategori: "SURAT",
      judul: "Persyaratan Surat Keterangan Domisili (Pindah Datang)",
      isi: "1. SKPWNI (Surat Keterangan Pindah WNI) dari Disdukcapil daerah asal.\n2. Surat Pernyataan Kerelaan Penggunaan Alamat, ditandatangani pemilik rumah dan diketahui RT setempat.\n3. KTP-el asli dari daerah asal.\n4. Dokumen pendukung lain sesuai kebutuhan pelayanan.\n\nSemua layanan adminduk GRATIS, tidak dipungut biaya.",
    },
    {
      kategori: "PROGRAM",
      judul: "Pelatihan Pembuatan Lilin Aromaterapi dari Minyak Jelantah",
      isi: "Program pemberdayaan mengolah minyak jelantah menjadi lilin aromaterapi. Alat: kompor, panci, saringan, cetakan lilin, kayu stik. Bahan: minyak jelantah 500 ml, parafin 250 g, arang, pewarna (opsional), essential oil, sumbu lilin.\n\nManfaat: mengurangi pencemaran, nilai guna limbah, dekorasi, hadiah, potensi UMKM.",
    },
    {
      kategori: "PROGRAM",
      judul: "Pelatihan Pembuatan Sabun Cair Cuci Piring",
      isi: "Program pelatihan membuat sabun cair cuci piring sendiri. Lebih hemat, bisa disesuaikan kebutuhan, bebas bahan berbahaya, peluang usaha rumahan.\n\nBahan utama: Texapon, Amphitol, LabsNa, Sodium Sulfat, EDTA 4Na, NaCl, pewarna, parfum.",
    },
    {
      kategori: "POSYANDU",
      judul: "Jadwal Posyandu Sindoro",
      isi: "Posyandu Sindoro melayani penimbangan balita, imunisasi, dan penyuluhan kesehatan.\n\nJadwal: setiap bulan (tanggal menyesuaikan kalender desa), pukul 08.00 - 11.00 WIB. [DUMMY - konfirmasi jadwal riil ke kader]\n\nPengurus: Ketua Sumiyati, Sekretaris Paini, Bendahara Sukinem, Anggota Jumini & Wagini.",
    },
    {
      kategori: "KONTAK",
      judul: "Kontak Kantor Padukuhan Jambon",
      isi: "Alamat: Jambon, Hargomulyo, Gedangsari, Gunungkidul, DI Yogyakarta 55863.\nWhatsApp: 0895-2938-6144.\nJam layanan: Senin - Jumat, 08.00 - 14.00 WIB.",
    },
    {
      kategori: "UMUM",
      judul: "Bahaya Pinjaman Online Ilegal",
      isi: "Pinjol ilegal adalah layanan pinjam meminjam berbasis aplikasi/website tanpa izin OJK. Ciri-ciri: tidak terdaftar di OJK (cek www.ojk.go.id), proses sangat cepat tanpa verifikasi jelas, bunga tidak wajar, meminta akses data pribadi berlebihan, dan melakukan teror/intimidasi.\n\nTips aman: cek legalitas di ojk.go.id, gunakan layanan keuangan resmi, jangan mudah tergiur, lindungi data pribadi, kelola keuangan bijak.",
    },
  ];
  for (const k of kb) {
    await prisma.kbEntry.create({ data: k });
  }

  console.log("✅ Seed selesai.");
  console.log(`  Officials: ${officials.length} · Statistik: ${statistik.length}`);
  console.log(`  UMKM: ${umkm.length} · KbEntry: ${kb.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
