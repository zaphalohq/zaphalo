import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
// import { ClientConfigModule } from 'src/constro/modules/config/client-config.module';

@Module({
  imports: [
    UserModule,
  ],
  exports: [
    UserModule,
  ],
})
export class CoreModule {}
