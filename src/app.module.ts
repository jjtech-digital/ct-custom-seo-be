import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios'; 
import { ProductModule } from './product/product.module';
import { CtModule } from './ct/ct.module';
import { ConfigModule } from '@nestjs/config';
import { RuleModule } from './rule/rule.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    HttpModule,
    ProductModule,
    CtModule,
    RuleModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
