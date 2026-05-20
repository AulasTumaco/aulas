import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { SalonesModule } from './salones/salones.module';
import { MateriasModule } from './materias/materias.module';
import { DocentesModule } from './docentes/docentes.module';
import { ReservasModule } from './reservas/reservas.module';
import { ProgramasModule } from './programas/programas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    HealthModule,
    SalonesModule,
    MateriasModule,
    DocentesModule,
    ReservasModule,
    ProgramasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}