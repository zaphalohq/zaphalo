import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { LocalStorageProvider } from './local-storage.provider';
import { AwsS3StorageProvider } from './aws-s3-storage.provider';
import { UploadController } from 'src/modules/file-storage/controllers/file-upload.controller';
import { FileController } from 'src/modules/file-storage/controllers/file.controller';
import { FileService } from 'src/modules/file-storage/services/file.service';
import { REQUEST } from '@nestjs/core';
import { JwtModule } from 'src/modules/jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (request: any, configService: ConfigService) => {
        const storageProvider = configService.get<string>('STORAGE_PROVIDER');

        if (storageProvider === 's3') {
          const s3StorageProvider = new AwsS3StorageProvider(configService);
          return {
            storage: s3StorageProvider.getMulterStorage(),
          };
        } else {
          const localStorageProvider = new LocalStorageProvider();
          return {
            storage: localStorageProvider.getMulterStorage(request),
          };
        }
      },
      inject: [REQUEST, ConfigService],
    }),
    JwtModule
  ],
  controllers: [UploadController, FileController],
  providers: [FileService, LocalStorageProvider, AwsS3StorageProvider],
  exports: [FileService]
})
export class FileStorageModule {}

