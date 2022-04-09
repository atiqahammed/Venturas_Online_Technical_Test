import { Module } from '@nestjs/common';
import { CommonValidationService } from './common';

@Module({
  controllers: [],
  imports: [],
  providers: [
    CommonValidationService
  ],
  exports: [],
})

export class ValidationModule { }