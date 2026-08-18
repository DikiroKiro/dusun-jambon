-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "namaDesa" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "alamatKantor" TEXT NOT NULL,
    "noWhatsApp" TEXT NOT NULL,
    "emailDesa" TEXT,
    "jamLayanan" TEXT,
    "mapsEmbedUrl" TEXT,
    "visi" TEXT NOT NULL,
    "misi" TEXT NOT NULL,
    "sejarah" TEXT,
    "heroFoto" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Official" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "foto" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Dusun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "mapsQuery" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Statistik" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "tahun" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ringkasan" TEXT,
    "konten" TEXT NOT NULL,
    "coverFoto" TEXT,
    "penulis" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Umkm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "pemilik" TEXT,
    "deskripsi" TEXT NOT NULL,
    "noWhatsApp" TEXT,
    "alamat" TEXT,
    "foto" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggal" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "albumId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "caption" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Photo_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KbEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kategori" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Berita_slug_key" ON "Berita"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Album_slug_key" ON "Album"("slug");
