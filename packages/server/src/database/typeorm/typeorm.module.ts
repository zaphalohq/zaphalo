import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { typeORMCoreModuleOptions } from './core/core.datasource';
import { TypeORMService } from './typeorm.service';
import { typeORMWorkspaceModuleOptions } from 'src/database/typeorm/workspace/workspace.datasource';

const coreTypeORMFactory = async (): Promise<TypeOrmModuleOptions> => ({
  ...typeORMCoreModuleOptions,
  name: 'core',
});


@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMWorkspaceModuleOptions),
    TypeOrmModule.forRootAsync({
      useFactory: coreTypeORMFactory,
      name: 'core',
    }),
  ],
  providers: [TypeORMService,],
  exports: [TypeORMService],
})
export class TypeORMModule { }
