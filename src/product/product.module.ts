import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CtClientService } from '../ct/ct.services';
import { RuleService } from 'src/rule/rule.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CtClientService, RuleService],
})
export class ProductModule {}
