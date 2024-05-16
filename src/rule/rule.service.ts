import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CtClientService } from '../ct/ct.services';
import { ApiRoot } from '../interfaces/ct.interface';
import axios from 'axios';

@Injectable()
export class RuleService {
  apiRoot: ApiRoot;
  constructor(private ctClientService: CtClientService) {
    this.apiRoot = this.ctClientService.createApiClient(
      ctClientService.ctpClient,
    );
  }
  async getToken(): Promise<string> {
    try {
      const accessTokenUrl = `${process.env.CTP_AUTH_URL}/oauth/token?grant_type=client_credentials`;
      const basicAuth = Buffer.from(
        `${process.env.CTP_CLIENT_ID}:${process.env.CTP_CLIENT_SECRET}`,
      ).toString('base64');
      const requestBody = new URLSearchParams();
      requestBody.append('grant_type', 'client_credentials'); // Use the appropriate grant type
      requestBody.append('scope', process.env.CTP_SCOPES);
      const response = await axios.post(accessTokenUrl, requestBody, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  }
  async createRule(rules: string[]) {
    try {
      const result = await this.savePromptInCtCustomObj(rules);

      return {
        status: 200,
        message: 'The rules have been created successfully',
        data: result,
      };
    } catch (error) {
      console.error('Error creating rule:', error);
      throw error;
    }
  }

  async getSavedPrompt(accessToken: string) {
    try {
      const baseUrl = `${process.env.CTP_API_URL}/${process.env.CTP_PROJECT_KEY}/custom-objects/${process.env.CTP_CUSTOM_OBJ_CONTAINER_NAME}/${process.env.CTP_CUSTOM_OBJ_CONTAINER_KEY}`;
      const response = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching saved prompt:',
        error?.response?.data || error?.message,
      );
      throw new Error('Failed to fetch saved prompt');
    }
  }
  async savePromptInCtCustomObj(result: string[]) {
    try {
      const baseUrl = `${process.env.CTP_API_URL}/${process.env.CTP_PROJECT_KEY}/custom-objects`;
      const token = await this.getToken();
      const requestBody = {
        container: `${process.env.CTP_CUSTOM_OBJ_CONTAINER_NAME}`,
        key: `${process.env.CTP_CUSTOM_OBJ_CONTAINER_KEY}`,
        value: result,
      };

      const response = await axios.post(baseUrl, JSON.stringify(requestBody), {
        headers: {
          Authorization: `Bearer ${token}`,
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
