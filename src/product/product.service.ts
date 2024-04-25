import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CtClientService } from '../ct/ct.services';
import { ApiRoot } from '../interfaces/ct.interface';
import { getProducts } from '../graphql/product';
import { Product } from '@commercetools/platform-sdk';
import { Response } from 'src/interfaces/ct.interface';
import OpenAI from 'openai';
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
  async generateMetaData(query: string): Promise<Response> {
    const data = await this.queryOpenAi(query);
    return {
      status: 200,
      message: 'The query has been executed successfully',
      data,
    };
  }
  async queryOpenAi(query: string): Promise<any> {
    const openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await openAi.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      temperature: 0.5,
      max_tokens: 3500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      messages: [
        {
          role: 'user',
          content: `Generate seo Title and seo Description for product ${query}`,
        },
      ],
    });
    return response;
  }
}
