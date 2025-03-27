// import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// import { config } from 'dotenv';
// import { DataSource, DataSourceOptions } from 'typeorm';
// config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

// const isJest = process.argv.some((arg) => arg.includes('jest'));

// console.log(".............process.env.PG_DATABASE_URL...................", __dirname + '/../../../core/modules/user/*.entity{.ts,.js}');
// export const typeORMCoreModuleOptions: TypeOrmModuleOptions = {
//   url: process.env.PG_DATABASE_URL,
//   type: 'postgres',
//   logging: ['error'],
//   schema: 'core',
//   // entities: [
//   //   `${isJest ? '' : 'dist/'}/core/modules/**/*.entity{.ts,.js}`,
//   // ],
//   entities: [__dirname + '/../../../core/modules/user/*.entity{.ts,.js}', __dirname + '/../../../modules/**/*.entity{.ts,.js}'],
//   synchronize: true,
//   migrationsRun: false,
//   migrationsTableName: '_typeorm_migrations',
//   metadataTableName: '_typeorm_generated_columns_and_materialized_views',
//   migrations: [
//     `${isJest ? '' : 'dist/'}/database/migrations/*{.ts,.js}`,
//   ],
//   ssl:
//     process.env.PG_SSL_ALLOW_SELF_SIGNED === 'true'
//       ? {
//         rejectUnauthorized: false,
//       }
//       : undefined,
// };

// export const connectionSource = new DataSource(
//   typeORMCoreModuleOptions as DataSourceOptions,
// );

console.log("...........................")

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const isJest = process.argv.some((arg) => arg.includes('jest'));

console.log(".............process.env.PG_DATABASE_URL...................", __dirname + '/../../../core/modules/user/*.entity{.ts,.js}');
export const typeORMCoreModuleOptions: TypeOrmModuleOptions = {
  url: process.env.PG_DATABASE_URL,
  type: 'postgres',
  logging: ['error'],
  schema: 'core',
  entities: [
    `${isJest ? '' : 'dist/'}/modules/**/*.entity{.ts,.js}`,
  ],
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: '_typeorm_migrations',
  metadataTableName: '_typeorm_generated_columns_and_materialized_views',
  migrations: [
    `${isJest ? '' : 'dist/'}/database/migrations/*{.ts,.js}`,
  ],
  ssl:
    process.env.PG_SSL_ALLOW_SELF_SIGNED === 'true'
      ? {
        rejectUnauthorized: false,
      }
      : undefined,
};

export const connectionSource = new DataSource(
  typeORMCoreModuleOptions as DataSourceOptions,
);
