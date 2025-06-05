import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { channelModule } from './channel/channel.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { TemplateModule } from './template/template.module';
import { MailingListModule } from './mailingList/mailingList.module';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    ContactsModule,
    channelModule,
    WorkspaceModule,
    TemplateModule,
    MailingListModule
  ],
  exports: [
    UserModule,
    AuthModule,
    ContactsModule,
    channelModule,
    WorkspaceModule,
    TemplateModule,
    MailingListModule
  ],
})
export class CoreModule {}
