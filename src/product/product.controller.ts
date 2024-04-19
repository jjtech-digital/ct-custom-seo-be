import {  Controller,  Get, HttpCode,  Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'src/interfaces/ct.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('')
  @HttpCode(201)
  async getAllProductDetails(@Query('limit') limit: number, @Query('offset') offset: number): Promise<Response> {
    return await this.productService.productDetails(limit, offset);
  }
}
