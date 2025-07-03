import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from '../../../modules/user/user.entity';
import { Workspace } from '../../../modules/workspace/workspace.entity';
import { WorkspaceMember } from '../../../modules/workspace/workspaceMember.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Broadcast } from '../../../customer-modules/broadcast/broadcast.entity';
config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const isJest = process.argv.some((arg) => arg.includes('jest'));

export const typeORMWorkspaceModuleOptions: TypeOrmModuleOptions = {
  url: process.env.PG_DATABASE_URL,
  type: 'postgres',
  logging: ['error'],
  entities: [
    `${isJest ? '' : 'dist/'}/src/customer-modules/**/*.entity{.ts,.js}`,
  ],
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: '_typeorm_migrations',
  metadataTableName: '_typeorm_generated_columns_and_materialized_views',
  migrations: [
    `${isJest ? '' : 'dist/'}/src/database/typeorm/workspace/migrations/*{.ts,.js}`,
  ],
  ssl:
    process.env.PG_SSL_ALLOW_SELF_SIGNED === 'true'
      ? {
        rejectUnauthorized: false,
      }
      : undefined,
};

export const workspaceConnectionSource = new DataSource(
  typeORMWorkspaceModuleOptions as DataSourceOptions,
);

// export const connectionSource = new DataSource(
//   typeORMWorkspaceModuleOptions as DataSourceOptions,
// );