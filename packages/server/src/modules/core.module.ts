import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { FileUploadModule } from './file-upload/fileUpload.module';
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceManagerModule,
    FileUploadModule
  ],
  exports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceManagerModule,
    FileUploadModule
  ],
})
export class CoreModule { }
