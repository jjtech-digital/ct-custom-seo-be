import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CtClientService } from '../ct/ct.services';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CtClientService]
})
export class ProductModule {}
