import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { FileUploadModule } from './file-upload/fileUpload.module';
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';
import { SystemConfigModule } from 'src/modules/system-config/system-config.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceManagerModule,
    FileUploadModule,
    SystemConfigModule,
  ],
  exports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceManagerModule,
    FileUploadModule,
    SystemConfigModule
  ],
})
export class CoreModule { }
