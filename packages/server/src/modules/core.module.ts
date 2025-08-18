import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';
import { SystemConfigModule } from 'src/modules/system-config/system-config.module';
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';
import { ConfigService } from '@nestjs/config';
import { MessageQueueModule } from 'src/modules/message-queue/message-queue.module';
import { QueueManagerModuleFactory } from 'src/modules/message-queue/message-queue-module.factory';



@Module({
  imports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    WorkspaceManagerModule,
    SystemConfigModule,
    FileStorageModule,
    JwtModule,
    MessageQueueModule.registerAsync({
      useFactory: QueueManagerModuleFactory,
      inject: [ConfigService]
    })
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
