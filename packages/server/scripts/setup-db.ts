import console from 'console';

import { rawDataSource } from '../src/database/typeorm/raw/raw.datasource';

import { camelToSnakeCase, performQuery } from './utils';

rawDataSource
  .initialize()
  .then(async () => {
    await performQuery(
      'CREATE SCHEMA IF NOT EXISTS "public"',
      'create schema "public"',
    );
    await performQuery(
      'CREATE SCHEMA IF NOT EXISTS "core"',
      'create schema "core"',
    );

});