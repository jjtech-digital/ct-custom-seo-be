import { Module } from '@nestjs/common';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { CtClientService } from '../ct/ct.services';

@Module({
  controllers: [RuleController],
  providers: [RuleService, CtClientService],
})
export class RuleModule {}
