import { Module } from '@nestjs/common';
import { CustomI18nService } from './custom-i18n.service';

@Module({
  providers: [CustomI18nService],
  exports: [CustomI18nService],
})
export class SharedModule {}
