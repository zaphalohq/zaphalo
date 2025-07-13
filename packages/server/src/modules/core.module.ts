import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';
import { SystemConfigModule } from 'src/modules/system-config/system-config.module';
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceManagerModule,
    SystemConfigModule,
    FileStorageModule,
    JwtModule,
  ],
  exports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceManagerModule,
    SystemConfigModule,
    FileStorageModule,
    JwtModule,
  ],
})
export class CoreModule { }
