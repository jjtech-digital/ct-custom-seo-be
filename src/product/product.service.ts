import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CtClientService } from '../ct/ct.services';
import { ApiRoot } from '../interfaces/ct.interface';
import { getProducts } from '../graphql/product';
import { Product } from '@commercetools/platform-sdk';
import { Response } from 'src/interfaces/ct.interface';

@Injectable()
export class ProductService {
  apiRoot: ApiRoot;
  constructor(private ctClientService: CtClientService) {
    this.apiRoot = this.ctClientService.createApiClient(
      ctClientService.ctpClient,
    );
  }
  async productDetails(limit: number, offset: number): Promise<Response> {
    const totalProduct = (await this.apiRoot.products().get().execute()).body
      .total;

    const promise = [];
    if (offset < 0 || offset >= totalProduct) {
      throw new HttpException('Invalid offset value', HttpStatus.BAD_REQUEST);
    }

    try {
      promise.push(
        this.apiRoot
          .graphql()
          .post({
            body: {
              query: getProducts(),
              variables: {
                limit: Number(limit),
                offset: Number(offset),
              },
            },
          })
          .execute(),
      );

      const response = await Promise.all(promise);
      const products: Product[] = [];
      response.map((res: any) => {
        products.push(...res?.body?.data?.products?.results);
      });

      return {
        status: 200,
        message: 'The query has been executed successfully',
        data: products,
        total: totalProduct,
        limit: limit,
        offset: offset,
      };
    } catch (error) {
      console.log(error?.body?.errors);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
