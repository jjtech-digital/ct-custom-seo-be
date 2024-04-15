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
  async productDetails(): Promise<Response> {
    try {
      const promise = [];
      promise.push(
        this.apiRoot
          .graphql()
          .post({
            body: {
              query: getProducts(),
            },
          })
          .execute(),
      );
      const response = await Promise.all(promise);
      const products: Product[] = [];
      response.map((res: any) => {
        products.push(...res.body.data.products.results);
      });
      return {
        status: 200,
        message: 'The query has been executed successfully',
        data: products
      };
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
