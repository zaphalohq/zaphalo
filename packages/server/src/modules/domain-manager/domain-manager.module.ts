import { Module } from '@nestjs/common';
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';

@Module({
  providers: [DomainManagerService],
  exports: [DomainManagerService],
})
export class DomainManagerModule {}
