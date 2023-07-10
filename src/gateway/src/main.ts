import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

process.env.NATS_URL = 'http://localhost:4222';
process.env.ACCESS_TOKEN_SECRET = 'access token secret key';
process.env.REFRESH_TOKEN_SECRET = 'refresh token secret key';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
