import { Module } from '@nestjs/common';
import { AiKeyController } from './aiKey.controller';
import { AiKeyService } from './aiKey.service';
import { CtClientService } from '../ct/ct.services';

@Module({
  controllers: [AiKeyController],
  providers: [AiKeyService, CtClientService],
})
export class AiKeyModule  {}
