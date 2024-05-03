import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'src/interfaces/ct.interface';
import { QueryMetaDataDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  @HttpCode(201)
  async getAllProductDetails(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<Response> {
    return await this.productService.productDetails(limit, offset);
  }
  @Post('/generate-meta-data')
  @HttpCode(200)
  async getMetaData(@Body() body: QueryMetaDataDto): Promise<Response> {
    const { query } = body;
    return await this.productService.generateMetaData(query);
  }
}
