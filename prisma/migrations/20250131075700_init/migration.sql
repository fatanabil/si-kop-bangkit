-- CreateTable
CREATE TABLE "Anggota" (
    "id" SERIAL NOT NULL,
    "no_rek" TEXT NOT NULL,
    "nama_anggota" TEXT NOT NULL,
    "id_instansi" INTEGER NOT NULL,

    CONSTRAINT "Anggota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instansi" (
    "id" SERIAL NOT NULL,
    "kode_ins" TEXT NOT NULL,
    "nama_ins" TEXT NOT NULL,

    CONSTRAINT "Instansi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mutasi" (
    "id" SERIAL NOT NULL,
    "id_instansi_dari" INTEGER NOT NULL,
    "id_instansi_ke" INTEGER NOT NULL,
    "bulan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_anggota" INTEGER NOT NULL,

    CONSTRAINT "Mutasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Anggota" ADD CONSTRAINT "Anggota_id_instansi_fkey" FOREIGN KEY ("id_instansi") REFERENCES "Instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mutasi" ADD CONSTRAINT "Mutasi_id_anggota_fkey" FOREIGN KEY ("id_anggota") REFERENCES "Anggota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mutasi" ADD CONSTRAINT "Mutasi_id_instansi_dari_fkey" FOREIGN KEY ("id_instansi_dari") REFERENCES "Instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mutasi" ADD CONSTRAINT "Mutasi_id_instansi_ke_fkey" FOREIGN KEY ("id_instansi_ke") REFERENCES "Instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
