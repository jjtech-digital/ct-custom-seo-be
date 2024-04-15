import { Module } from '@nestjs/common';
import { CtClientService } from './ct.services';

@Module({
    providers: [CtClientService],
    exports: [CtClientService]
})
export class CtModule {
    
}

