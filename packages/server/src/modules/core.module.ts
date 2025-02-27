import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { WhatsappinstantsModule } from '../../components/whatsappinstants/instants.module';
// import { ClientConfigModule } from 'src/constro/modules/config/client-config.module';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    // WhatsappinstantsModule,
  ],
  exports: [
    UserModule,
    AuthModule,
    // WhatsappinstantsModule,
  ],
})
export class CoreModule {}
