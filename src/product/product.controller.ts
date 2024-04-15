import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'src/interfaces/ct.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('')
  @HttpCode(201)
  async getAllProductDetails(): Promise<Response> {
    return await this.productService.productDetails();
  }
}
