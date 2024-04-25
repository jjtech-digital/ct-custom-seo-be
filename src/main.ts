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
  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET, POST, PUT, DELETE',
  //   allowedHeaders: 'Content-Type, Authorization',
  // });
  app.enableCors();

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  //   next();
  // });

  // app.enableCors({
  //   allowedHeaders: '*',
  //   origin: '*',
  //   credentials: true
  // });

  await app.listen(PORT);
  console.log(`Started server listening on : ${await app.getUrl()}`);
}
bootstrap();
