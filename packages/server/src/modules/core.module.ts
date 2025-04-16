import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { channelModule } from './channel/channel.module';
import { workspaceModule } from './workspace/workspace.module';
// import { WhatsappinstantsModule } from '../../components/whatsappinstants/instants.module';
// import { ClientConfigModule } from 'src/constro/modules/config/client-config.module';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    ContactsModule,
    channelModule,
    workspaceModule
    // WhatsappinstantsModule, it is direcly add at app.module
  ],
  exports: [
    UserModule,
    AuthModule,
    ContactsModule,
    channelModule,
    workspaceModule,
    // WhatsappinstantsModule,
  ],
})
export class CoreModule {}
