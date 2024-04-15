import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { HttpModule } from '@nestjs/axios';
import { HttpModule } from '@nestjs/axios'; 
import { ProductModule } from './product/product.module';
import { CtModule } from './ct/ct.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    HttpModule,
    ProductModule,
    CtModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
