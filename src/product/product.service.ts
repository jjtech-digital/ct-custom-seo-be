import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CtClientService } from '../ct/ct.services';
import { ApiRoot, OpenAIResponse } from '../interfaces/ct.interface';
import { getProducts } from '../graphql/product';
import { Product } from '@commercetools/platform-sdk';
import { Response } from '../interfaces/ct.interface';
import OpenAI from 'openai';
import axios from 'axios';
import { RuleService } from '../rule/rule.service';
import { getProductDetails } from '../graphql/productDetails';
@Injectable()
export class ProductService {
  apiRoot: ApiRoot;
  constructor(
    private ctClientService: CtClientService,
    private ruleService: RuleService,
  ) {
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
  async getProductById(id: string): Promise<Response> {
    try {
      const response = await this.apiRoot
        .graphql()
        .post({
          body: {
            query: getProductDetails(),
            variables: {
              id
            },
          },
        })
        .execute();

      const product = response.body.data.product;

      if (!product) {
        throw new HttpException(
          `Product with ID ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: 200,
        message: 'Product found successfully',
        data: product,
      };
    } catch (error) {
      console.error('Error retrieving product by ID:', error);
      throw new HttpException(
        'Failed to retrieve product details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async generateMetaData(
    productId: string,
    accessToken?: string,
  ): Promise<OpenAIResponse> {
    try {
      const productResponse = await this.getProductById(productId);

      const productName = productResponse.data.masterData.current.name;
      const categories = productResponse.data.masterData.current.categories;

      const categoryNames = categories
        .map((category) => category.name)
        .join(', ');
      const query = `Product name: "${productName}", Categories: "${categoryNames}"`;
      const data = await this.queryOpenAi(query, accessToken);

      return {
        status: 200,
        message: 'Query executed successfully',
        data: data,
      };
    } catch (error) {
      console.error('Error generating metadata:', error);
      throw new HttpException(
        'Failed to generate metadata',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async queryOpenAi(query: string, accessToken?: string): Promise<any> {
    const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let updatedPrompt = '';
    if (accessToken) {
      const prompt = await this.ruleService.getSavedPrompt(accessToken);
      updatedPrompt = prompt.value.join(' ');
    }

    let contentString = `Find the SEO title and description for product with ${query}`;

    // Append rules to the content string if updatedPrompt is not empty
    if (updatedPrompt) {
      contentString += ` and Rules: ${updatedPrompt}`;
    }
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
          content: contentString,
        },
      ],
    });
    return response;
  }
}
