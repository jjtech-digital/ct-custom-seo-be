import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common';
import { OpenAiKeyDto } from './dto/openai-key.dto';
import { AiKeyService } from './aiKey.service';

@Controller('ai-key')
export class AiKeyController {
  constructor(private readonly aiKeyService: AiKeyService) {}

  @Get()
  async getOpenAiKey(
    @Headers('Authorization') accessToken: string,
  ): Promise<any> {
    const token = accessToken?.replace('Bearer ', '');
    return await this.aiKeyService.getAiKey(token);
  }
  @Post()
  async handleOpenAiKey(@Body() body: OpenAiKeyDto): Promise<void> {
    const { aiKey, accessToken } = body;
    const token = accessToken?.replace('Bearer ', '');
    return await this.aiKeyService.processOpenAiKey(aiKey, token);
  }
}
