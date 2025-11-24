import { DynamicModule, Global, Module } from '@nestjs/common';

import { FileStorageDriverFactory } from 'src/modules/file-storage/file-storage-driver.factory';
import { FileStorageService } from 'src/modules/file-storage/file-storage.service';

@Global()
@Module({})
export class FileStorageModule {
  static forRoot(): DynamicModule {
    return {
      module: FileStorageModule,
      imports: [],
      providers: [FileStorageDriverFactory, FileStorageService],
      exports: [FileStorageService],
    };
  }
}


