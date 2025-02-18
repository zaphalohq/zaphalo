import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { typeORMCoreModuleOptions } from './core/core.datasource';
import { TypeORMService } from './typeorm.service';
// import { EnvironmentModule } from 'src/constro/integrations/environment/environment.module';

// import { TypeORMService } from './typeorm.service';


// const metadataTypeORMFactory = async (): Promise<TypeOrmModuleOptions> => ({
//   ...typeORMMetadataModuleOptions,
//   name: 'metadata',
// });

const coreTypeORMFactory = async (): Promise<TypeOrmModuleOptions> => ({
  ...typeORMCoreModuleOptions,
  name: 'core',
});



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: coreTypeORMFactory,
      name: 'core',
    }),
    // EnvironmentModule,
  ],
  providers: [TypeORMService],
  exports: [TypeORMService],
})
export class TypeORMModule {}
