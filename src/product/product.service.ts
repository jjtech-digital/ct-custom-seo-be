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
  async getProductById(productId: string, locale: string): Promise<Response> {
    try {
      const response = await this.apiRoot
        .graphql()
        .post({
          body: {
            query: getProductDetails(),
            variables: {
              id: productId,
              Locale: locale,
            },
          },
        })
        .execute();

      const product = response.body.data.product;

      if (!product) {
        throw new HttpException(
          `Product with ID ${productId} not found.`,
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
    accessToken: string,
    locale: string,
    openAiKey: string,
  ): Promise<OpenAIResponse> {
    try {
      const productResponse = await this.getProductById(productId, locale);

      const productName = productResponse.data.masterData.current.name;
      const categories = productResponse.data.masterData.current.categories;

      const categoryNames = categories
        .map((category) => category.name)
        .join(', ');
      const query = `Product name: "${productName}", Categories: "${categoryNames}"`;

      const localeQuery = locale ? `, Locale: "${locale}"` : '';
      const data = await this.queryOpenAi(
        query + localeQuery,
        accessToken,
        openAiKey,
      );

      return {
        data: { ...data, productId: productId },
      };
    } catch (error) {
      console.error('Error generating metadata:', error);
      return error;
    }
  }
  async updateProductSeoMeta(
    productId: string,
    metaTitle: string,
    metaDescription: string,
    version: number,
    dataLocale: string,
    accessToken: string,
  ): Promise<Response> {
    const apiUrl = `https://api.australia-southeast1.gcp.commercetools.com/jj-seo-app/products/${productId}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const data = {
      version: version,
      actions: [
        {
          action: 'setMetaTitle',
          metaTitle: {
            [dataLocale]: metaTitle,
          },
          staged: false,
        },
        {
          action: 'setMetaDescription',
          metaDescription: {
            [dataLocale]: metaDescription,
          },
          staged: false,
        },
      ],
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      console.log('Product SEO meta updated successfully.');
      return {
        status: 200,
        message: 'Product SEO meta updated successfully.',
        data: response.data,
      };
    } catch (error) {
      console.error('Error updating product SEO meta:', error);
      throw new HttpException(
        'Failed to update product SEO meta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async queryOpenAi(
    query: string,
    accessToken?: string,
    openAiKey?: string,
  ): Promise<any> {
    const openAi = new OpenAI({ apiKey: openAiKey });
    let updatedPrompt = '';
    if (accessToken) {
      const prompt = await this.ruleService.getSavedPrompt(accessToken);
      const allEmpty = prompt.value.every((p) => /^\s*$/.test(p));

      // If any prompt is non-empty, update updatedPrompt
      if (!allEmpty) {
        updatedPrompt = prompt.value.join(' ');
      }
    }

    let contentString = `Find the SEO title and description for product with ${query}`;

    // Append rules to the content string if updatedPrompt is not empty
    if (updatedPrompt) {
      contentString += ` and Rules: ${updatedPrompt}`;
    } else {
      // Add fallback rules
      contentString += ` and Rules: Include the main keyword in both the title and description. Keep the title concise (50-60 characters) while making it compelling for clicks. Clearly communicate product benefits in the description to engage users and spark curiosity. Limit the description to under 150-160 characters for full visibility in search results.`;
    }
    try {
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
    } catch (error) {
      return error;
    }
  }
}
