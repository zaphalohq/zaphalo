import { Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';
import { SystemConfigModule } from 'src/modules/system-config/system-config.module';
import { FileStorageModule } from 'src/modules/file-storage/file-storage.module';
import { FileModule } from 'src/modules/file/file.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';
import { AppTokenModule } from './app-token/app-token.module';
import { ConfigService } from '@nestjs/config';
import { MessageQueueModule } from 'src/modules/message-queue/message-queue.module';
import { QueueManagerModuleFactory } from 'src/modules/message-queue/message-queue-module.factory';
import { WorkspaceInvitationModule } from 'src/modules/workspace-invitation/workspace-invitation.module';
import { ExceptionHandlerModule } from 'src/modules/exception-handler/exception-handler.module';
import { exceptionHandlerModuleFactory } from 'src/modules/exception-handler/exception-handler.module-factory';

@Module({
  imports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    AppTokenModule,
    WorkspaceManagerModule,
    SystemConfigModule,
    FileModule,
    FileStorageModule.forRoot(),
    JwtModule,
    WorkspaceInvitationModule,
    MessageQueueModule.registerAsync({
      useFactory: QueueManagerModuleFactory,
      inject: [ConfigService]
    }),
    ExceptionHandlerModule.forRootAsync({
      useFactory: exceptionHandlerModuleFactory,
      inject: [ConfigService, HttpAdapterHost],
    }),
  ],
  exports: [
    UserModule,
    AuthModule,
    WorkspaceModule,
    AppTokenModule,
    WorkspaceManagerModule,
    SystemConfigModule,
    FileStorageModule,
    JwtModule,
    WorkspaceInvitationModule,
  ],
})
export class CoreModule { }
