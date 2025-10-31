import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { createHash } from 'crypto';

import { StorageDriver } from 'src/modules/file-storage/drivers/interfaces/storage-driver.interface';
import { StorageDriverType } from 'src/modules/file-storage/interfaces/file-storage.interface';

import { LocalDriver } from 'src/modules/file-storage/drivers/local.driver';
import { S3Driver } from 'src/modules/file-storage/drivers/s3.driver';
import { resolveAbsolutePath } from 'src/utils/resolve-absolute-path';

@Injectable()
export class FileStorageDriverFactory {
  private currentDriver: StorageDriver | null = null;
  private currentConfigKey: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  getCurrentDriver(): StorageDriver {
    let configKey: string;

    try {
      configKey = this.buildConfigKey();
    } catch (error) {
      throw new Error(
        `Failed to build config key for ${this.constructor.name}. Original error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (this.currentConfigKey !== configKey) {
      try {
        this.currentDriver = this.createDriver();
      } catch (error) {
        throw new Error(
          `Failed to create driver for ${this.constructor.name} with config key: ${configKey}. Original error: ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      this.currentConfigKey = configKey;
    }

    if (!this.currentDriver) {
      throw new Error(
        `Failed to create driver for ${this.constructor.name} with config key: ${configKey}`,
      );
    }

    return this.currentDriver;
  }

  protected buildConfigKey(): string {
    const storageType = this.configService.get('STORAGE_TYPE');
    if (storageType === StorageDriverType.LOCAL) {
      const storagePath = this.configService.get('STORAGE_LOCAL_PATH');
      return `local|${storagePath}`;
    }

    if (storageType === StorageDriverType.S_3) {
      const storageConfigHash = this.getConfigGroupHash();

      return `s3|${storageConfigHash}`;
    }

    throw new Error(`Unsupported storage type: ${storageType}`);
  }

  protected getConfigGroupHash(): string {
    const groupVariables = [
      'STORAGE_S3_NAME',
      'STORAGE_S3_ENDPOINT',
      'STORAGE_S3_REGION',
      'STORAGE_S3_ACCESS_KEY_ID',
      'STORAGE_S3_SECRET_ACCESS_KEY',
    ]

    const configValues = groupVariables
      .map((key) => `${key}=${this.configService.get(key)}`)
      .sort()
      .join('|');

    return createHash('sha256')
      .update(configValues)
      .digest('hex')
      .substring(0, 16);
  }

  protected createDriver(): StorageDriver {
    const storageType = this.configService.get('STORAGE_TYPE');
    switch (storageType) {
      case StorageDriverType.LOCAL: {
        const storagePath = this.configService.get('STORAGE_LOCAL_PATH');

        return new LocalDriver({
          storagePath: resolveAbsolutePath(storagePath),
        });
      }

      case StorageDriverType.S_3: {
        const bucketName = this.configService.get('STORAGE_S3_NAME');
        const endpoint = this.configService.get('STORAGE_S3_ENDPOINT');
        const region = this.configService.get('STORAGE_S3_REGION');
        const accessKeyId = this.configService.get(
          'STORAGE_S3_ACCESS_KEY_ID',
        );
        const secretAccessKey = this.configService.get(
          'STORAGE_S3_SECRET_ACCESS_KEY',
        );

        return new S3Driver({
          bucketName: bucketName ?? '',
          endpoint: endpoint,
          credentials: accessKeyId
            ? { accessKeyId, secretAccessKey }
            : fromNodeProviderChain({ clientConfig: { region } }),
          forcePathStyle: true,
          region: region ?? '',
        });
      }

      default:
        throw new Error(`Invalid storage driver type: ${storageType}`);
    }
  }
}
