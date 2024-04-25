import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // env config
   config({ path: resolve(__dirname, '../.env') });
     // port
  const PORT = process.env.PORT || 3002;
  
  // cors setup
  app.enableCors({
    origin: ['http://localhost:3002', 'https://ct-custom-seo-be.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  })
  await app.listen(PORT);
  console.log(`Started server listeing on : ${await app.getUrl()}`);
}
bootstrap();
