import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions-filter';
import { HttpResponseInterceptor } from './common/interseptor/http-response.interceptor';
require('dotenv').config();

const log = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new HttpResponseInterceptor());

  const corsOrigin = '*';

  app.enableCors({
    origin: corsOrigin,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept',
  });


  const config = new DocumentBuilder()
    .setTitle('Techinal Test API')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('Techinal Test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  
  log.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
