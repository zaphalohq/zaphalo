import { rawDataSource } from '../src/database/typeorm/raw/raw.datasource';

import { performQuery } from './utils';

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
    await performQuery(
      'CREATE SCHEMA IF NOT EXISTS "workspace_default"',
      'create schema "workspace_default"',
    );
});