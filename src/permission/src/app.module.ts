import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'NATS',
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}