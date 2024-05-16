import {
  Body,
  Controller,
  Get,
  HttpCode,
  Query,
  Post,
  Headers,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { Response } from 'src/interfaces/ct.interface';

@Controller('rule')
export class RuleController {
  constructor(private readonly RuleService: RuleService) {}

  @Get('')
  @HttpCode(201)
  async generateToken(): Promise<string> {
    return await this.RuleService.getToken();
  }

  @Post('/create-rules')
  @HttpCode(201)
  async getRuleDetails(@Body() body): Promise<Response> {
    const { rules } = body;
    return await this.RuleService.createRule(rules);
  }

  @Get('/saved-rules')
  @HttpCode(200)
  async getSavedPrompt(
    @Headers('Authorization') accessToken: string,
  ): Promise<any> {
    const token = accessToken?.replace('Bearer ', '');
    return await this.RuleService.getSavedPrompt(token);
  }
}
