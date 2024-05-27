import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Response } from 'src/interfaces/ct.interface';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  @HttpCode(201)
  async getAllProductDetails(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('locale') locale: string,
  ): Promise<Response> {
    return await this.productService.productDetails(limit, offset, locale);
  }

  @Post('/get-product-by-id')
  @HttpCode(200)
  async getProductById(
    @Body('id') id: string,
    @Body('locale') locale: string,
  ): Promise<Response> {
    return await this.productService.getProductById(id, locale);
  }

  @Post('/generate-meta-data')
  @HttpCode(200)
  async getMetaData(
    @Body()
    body: {
      id: string;
      token: string;
      locale: string;
      openAiKey: string;
    },
  ): Promise<Response> {
    const { id, token, locale, openAiKey } = body;
    const accessToken = token?.replace('Bearer ', '');
    return await this.productService.generateMetaData(
      id,
      accessToken,
      locale,
      openAiKey,
    );
  }
  @Post('/update-seo-meta/:productId')
  @HttpCode(200)
  async updateProductSeoMeta(
    @Param('productId') productId: string,
    @Body()
    body: {
      metaTitle: string;
      metaDescription: string;
      version: number;
      dataLocale: string;
    },
    @Headers('authorization') authorization: string,
  ): Promise<Response> {
    const { metaTitle, metaDescription, version, dataLocale } = body;
    const accessToken = authorization?.replace('Bearer ', '');
    return await this.productService.updateProductSeoMeta(
      productId,
      metaTitle,
      metaDescription,
      version,
      dataLocale,
      accessToken,
    );
  }
  @Post('/bulk-generate-meta-data')
  @HttpCode(200)
  async bulkGenerateMetaData(
    @Body()
    body: {
      ids: string[];
      token: string;
      locale: string;
      openAiKey: string;
    },
  ): Promise<Response[]> {
    const { ids, token, locale, openAiKey } = body;
    const metaDataPromises = ids.map(async (id) => {
      const accessToken = token?.replace('Bearer ', '');
      return await this.productService.generateMetaData(
        id,
        accessToken,
        locale,
        openAiKey,
      );
    });
    const metaDataResponses = await Promise.all(metaDataPromises);
    return metaDataResponses;
  }

  @Post('/bulk-update-seo-meta')
  @HttpCode(200)
  async applyBulkProductSeoMeta(
    @Body() body: { products: any[]; token: string },
  ): Promise<Response[]> {
    const { products, token } = body;
    const accessToken = token?.replace('Bearer ', '');
    const applyBulkPromises = products.map(async (product) => {
      return await this.productService.updateProductSeoMeta(
        product.productId,
        product.metaTitle,
        product.metaDescription,
        product.version,
        product.dataLocale,
        accessToken,
      );
    });
    const applyBulkResponses = await Promise.all(applyBulkPromises);

    return applyBulkResponses;
  }
  @Get('/search')
  @HttpCode(200)
  async searchProducts(
    @Query('query') query: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('locale') locale: string,
  ): Promise<Response> {
    return await this.productService.searchProduct(
      query,
      limit,
      offset,
      locale,
    );
  }
}
