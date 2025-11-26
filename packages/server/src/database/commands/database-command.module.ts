import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UpgradeCommand } from 'src/database/commands/upgrade.command';
import { CommandLogger } from 'src/database/commands/logger';
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { WhatsAppTemplateSyncCronCommand } from 'src/customer-modules/whatsapp/crons/commands/whatsapp-template-sync.command';
import { BroadcastSendCronCommand } from 'src/customer-modules/broadcast/crons/commands/broadcast-send-cron.command';
import { CronRegisterAllCommand } from 'src/database/commands/cron-register-all.command';


@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace], 'core'),
    TypeORMModule,
  ],
  providers: [
    CommandLogger,
    UpgradeCommand,
    WhatsAppTemplateSyncCronCommand,
    BroadcastSendCronCommand,
    CronRegisterAllCommand,
  ],
})

export class DatabaseCommandModule {}
