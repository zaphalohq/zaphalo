import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';
import { DataSource, getConnectionManager, DataSourceOptions } from 'typeorm';
import { typeORMWorkspaceModuleOptions } from 'src/database/typeorm/workspace/workspace.datasource';

@Injectable()
export class TypeORMService implements OnModuleInit, OnModuleDestroy {
  private mainDataSource: DataSource;
  private dataSources: Map<string, DataSource> = new Map();
  private isDatasourceInitializing: Map<string, boolean> = new Map();

  constructor() {
    this.mainDataSource = new DataSource({
      url: process.env.PG_DATABASE_URL,
      type: 'postgres',
      logging: false,
      schema: 'core',
      entities: [
        User,
        Workspace,
        WorkspaceMember,
      ],
      ssl: undefined,
    });
  }

  public getMainDataSource(): DataSource {
    return this.mainDataSource;
  }

  public async getWorkspaceConnection(
    schema: string,
  ): Promise<DataSource> {
    const connectionName = schema;
    const connectionManager = getConnectionManager();

    if (connectionManager.has(connectionName)) {
      const connection = connectionManager.get(connectionName);
      return Promise.resolve(connection.isConnected ? connection : connection.connect());
    }

    const dataSource = new DataSource({
      ...typeORMWorkspaceModuleOptions,
      name: connectionName,
      schema: connectionName,
    } as DataSourceOptions);

    return await dataSource.initialize();

  }

  public async disconnectFromDataSource(dataSourceId: string) {
    if (!this.dataSources.has(dataSourceId)) {
      return;
    }

    const dataSource = this.dataSources.get(dataSourceId);

    await dataSource?.destroy();

    this.dataSources.delete(dataSourceId);
  }

  public async createSchema(schemaName: string): Promise<string> {
    const queryRunner = this.mainDataSource.createQueryRunner();
    await queryRunner.createSchema(schemaName, true);
    await queryRunner.release();
    return schemaName;
  }

  public async deleteSchema(schemaName: string) {
    const queryRunner = this.mainDataSource.createQueryRunner();
    await queryRunner.dropSchema(schemaName, true, true);
    await queryRunner.release();
  }

  async onModuleInit() {
    await this.mainDataSource.initialize();
  }

  async onModuleDestroy() {
    await this.mainDataSource.destroy();
    for (const [, dataSource] of this.dataSources) {
      await dataSource.destroy();
    }
  }
}
