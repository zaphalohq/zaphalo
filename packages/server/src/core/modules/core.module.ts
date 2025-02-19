import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { ClientConfigModule } from 'src/constro/modules/config/client-config.module';

@Module({
  imports: [
    UserModule, 
    AuthModule,
  ],
  exports: [
    UserModule,
    AuthModule,
  ],
})
export class CoreModule {}
