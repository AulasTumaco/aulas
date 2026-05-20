-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('LIBRE', 'OCUPADO', 'RESERVADO');

-- CreateTable
CREATE TABLE "ProgramaAcademico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramaAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salon" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "edificio" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "tieneProyector" BOOLEAN NOT NULL DEFAULT false,
    "tieneAC" BOOLEAN NOT NULL DEFAULT false,
    "tieneTablero" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "matriculados" INTEGER NOT NULL,
    "programaAcademicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "programaAcademicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "salonId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'RESERVADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramaAcademico_nombre_key" ON "ProgramaAcademico"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Salon_codigo_key" ON "Salon"("codigo");

-- CreateIndex
CREATE INDEX "Salon_edificio_idx" ON "Salon"("edificio");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_codigo_key" ON "Materia"("codigo");

-- CreateIndex
CREATE INDEX "Materia_programaAcademicoId_idx" ON "Materia"("programaAcademicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_correo_key" ON "Docente"("correo");

-- CreateIndex
CREATE INDEX "Docente_programaAcademicoId_idx" ON "Docente"("programaAcademicoId");

-- CreateIndex
CREATE INDEX "Reserva_salonId_idx" ON "Reserva"("salonId");

-- CreateIndex
CREATE INDEX "Reserva_fecha_idx" ON "Reserva"("fecha");

-- CreateIndex
CREATE INDEX "Reserva_horaInicio_idx" ON "Reserva"("horaInicio");

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_programaAcademicoId_fkey" FOREIGN KEY ("programaAcademicoId") REFERENCES "ProgramaAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_programaAcademicoId_fkey" FOREIGN KEY ("programaAcademicoId") REFERENCES "ProgramaAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
