import { NestFactory } from '@nestjs/core';
import { CiphorModule } from './ciphor.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CiphorModule, {
    logger: ['error', 'warn'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Ciphor Api (Encrypt/Decrypt)')
    .setDescription(
      'service exposes two endpoints to save and retrieve values while storing them securely ',
    )
    .setVersion('1.0')
    .addTag('ciphor')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
