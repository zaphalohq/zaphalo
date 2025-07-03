import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { ContactsModule } from './contacts/contacts.module';
// import { channelModule } from './channel/channel.module';
import { WorkspaceModule } from './workspace/workspace.module';
// import { TemplateModule } from './template/template.module';
// import { MailingListModule } from './mailingList/mailingList.module';
// import { BroadcastModule } from './broadcast/broadcast.module';
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';
import { FileUploadModule } from './file-upload/fileUpload.module';

@Module({
  imports: [
    UserModule, 
    AuthModule,
    WorkspaceModule,
    //     ContactsModule,
    // channelModule,
    // TemplateModule,
    // MailingListModule,
    // BroadcastModule,
    WorkspaceManagerModule,
    FileUploadModule
  ],
  exports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    //     ContactsModule,
    // channelModule,
    // TemplateModule,
    // MailingListModule,
    // BroadcastModule,
    WorkspaceManagerModule,
    FileUploadModule
  ],
})
export class CoreModule {}
