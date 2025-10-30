import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CommandRunner, Command, Option } from 'nest-commander';
import { DataSource, Repository } from 'typeorm';

import { CommandLogger } from './logger';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { TypeORMService } from 'src/database/typeorm/typeorm.service';

@Command({
  name: 'upgrade',
  arguments: '[task]',
  description: 'A parameter parse',
})
export class UpgradeCommand extends CommandRunner {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly typeormService: TypeORMService,
    private readonly logService: CommandLogger) {
    super()
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    await this.runWorkspaceMigration();
    return Promise.resolve(undefined);
  }

  private async loadActiveWorkspace() {
    const activeWorkspaces = await this.workspaceRepository.find({
      select: ['id'],
      where: {
        isWorkspaceSetup: true,
      },
    });
    return activeWorkspaces.map((workspace) => workspace.id);
  }

  async runWorkspaceMigration(): Promise<boolean> {
    const activeWorkspaces = await this.loadActiveWorkspace()
    for (const [index, workspaceId] of activeWorkspaces.entries()) {
      this.logService.log(`Workspace migration started for ${workspaceId}`)
      const schemaName = `workspace_${workspaceId}`;
      const workspaceDataSource = await this.typeormService.getWorkspaceConnection(schemaName);
      await workspaceDataSource.runMigrations()
      await workspaceDataSource.close();
      this.logService.log(`Workspace migration completed for ${workspaceId}`)
    }
    return true
  }
  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }
}