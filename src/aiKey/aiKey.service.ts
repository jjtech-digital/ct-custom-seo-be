import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CtClientService } from '../ct/ct.services';
import { ApiRoot } from '../interfaces/ct.interface';
import axios from 'axios';

@Injectable()
export class AiKeyService {
  apiRoot: ApiRoot;
  constructor(private ctClientService: CtClientService) {
    this.apiRoot = this.ctClientService.createApiClient(
      ctClientService.ctpClient,
    );
  }

  async getAiKey(accessToken: string) {
    try {
      const baseUrl = `${process.env.CTP_API_URL}/${process.env.CTP_PROJECT_KEY}/custom-objects/${process.env.CTP_CUSTOM_OBJ_AI_CONTAINER_NAME}/${process.env.CTP_CUSTOM_OBJ_AI_CONTAINER_KEY}`;

      const response = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error while retrieving data:', error);
      throw new HttpException(
        'Failed to retrieve AI key',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async processOpenAiKey(aiKeykey: string, accessToken: string): Promise<any> {
    try {
      const response = await this.saveAiKeyCustomObj(aiKeykey, accessToken);
      return {
        status: 200,
        message: 'Key saved successfully',
        data: response,
      };
    } catch (error) {
      console.error('Error while saving data:', error);
      throw error;
    }
  }
  async saveAiKeyCustomObj(aiKeykey: string, accessToken: string) {
    try {
      const baseUrl = `${process.env.CTP_API_URL}/${process.env.CTP_PROJECT_KEY}/custom-objects`;
      const requestBody = {
        container: process.env.CTP_CUSTOM_OBJ_AI_CONTAINER_NAME,
        key: process.env.CTP_CUSTOM_OBJ_AI_CONTAINER_KEY,
        value: aiKeykey,
      };

      const response = await axios.post(baseUrl, JSON.stringify(requestBody), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error while saving data:', error);
      throw error;
    }
  }
}
