import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CtClientService } from '../ct/ct.services';
import { ApiRoot } from '../interfaces/ct.interface';
import OpenAI from 'openai';
import axios from 'axios';
class CrossOver {
  ruleService: RuleService;

  constructor(ruleService: RuleService) {
    this.ruleService = ruleService;
  }
  crossover = async (prompts: string[]) => {
    let openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    let content = `create a grammer based crossover between "${prompts.join(
      `", "`,
    )}"`;

    const messages: any = [
      {
        role: 'user',
        content,
      },
    ];
    const response = await openAi.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'find_crossover',
            description: 'Find the crossover between sentences',
            parameters: {
              type: 'object',
              properties: {
                prompt: {
                  type: 'string',
                  description: 'Grammer based crossover between the sentences',
                },
              },
              required: ['prompt'],
            },
          },
        },
      ],
      tool_choice: 'auto',
    });
    const responseMessage = response.choices[0].message;

    const toolCalls: any = responseMessage.tool_calls;
    if (toolCalls) {
      messages.push(responseMessage);
      const crossoverPrompts: string[] = [];
      for (let call of toolCalls) {
        const args = JSON.parse(call.function.arguments);
        const prompt = args.prompt;
        crossoverPrompts.push(prompt);
      }

      await this.ruleService.savePromptInCtCustomObj(crossoverPrompts);
    }
    return response;
  };
}
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
  async getRule(rules: any) {
    const data = await this.queryOpenAI(rules);
    return {
      status: 200,
      message: 'The rule has been created successfully',
      data: data,
    };
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
  async queryOpenAI(prompts: any) {
    const crossover = new CrossOver(this);
    let prompt = await crossover.crossover(prompts);
    return prompt;
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

      return response;
    } catch (error) {
      console.error('Error while saving data:', error);
      throw error;
    }
  }
}
