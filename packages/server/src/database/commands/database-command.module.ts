import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UpgradeCommand } from 'src/database/commands/upgrade.command';
import { CommandLogger } from 'src/database/commands/logger';
import { TypeORMModule } from "src/database/typeorm/typeorm.module";
import { WorkspaceManagerModule } from 'src/modules/workspace-manager/workspace.manager.module';
import { Workspace } from 'src/modules/workspace/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace], 'core'),
    TypeORMModule,
  ],
  providers: [CommandLogger, UpgradeCommand],
})

export class DatabaseCommandModule {}
