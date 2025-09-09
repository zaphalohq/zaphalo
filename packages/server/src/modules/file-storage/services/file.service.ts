import { Inject, Injectable } from "@nestjs/common";

import { createReadStream, existsSync } from 'fs';
import * as fs from 'fs/promises';
import { dirname, join } from 'path';
import { Readable } from 'stream';

import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly configService: ConfigService
  ) { }

  async getFileStream(params: {
    folderPath: string;
    filename: string;
  }): Promise<Readable> {

    const storagePath = this.configService.get('STORAGE_LOCAL_PATH');

    let fileStoragePath = `${storagePath || '.local-storage'}`;

    const filePath = join(process.cwd(),
  `${fileStoragePath}/files-storage/`,
  params.folderPath,
  params.filename,
  );
    if (!existsSync(filePath)) {
      throw new Error(
        'File not found',
        );
    }

    try {
      return createReadStream(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(
          'File not found',
          );
      }

      throw error;
    }
  }

  encodeFileToken(payloadToEncode: Record<string, any>) {
    const fileTokenExpiresIn = '1d';
    const secret = this.jwtWrapperService.generateAppSecret(
      'FILE',
      payloadToEncode.workspaceId,
    );

    const signedPayload = this.jwtWrapperService.sign(
      {
        ...payloadToEncode,
      },
      {
        secret,
        expiresIn: fileTokenExpiresIn,
      },
    );

    return signedPayload;
  }

  async createFolder(path: string) {
    return fs.mkdir(path, { recursive: true });
  }

  async write(params: {
    file: Buffer | Uint8Array | string;
    name: string;
    folder: string;
    mimeType: string | undefined;
  }): Promise<void> {
    const storagePath = this.configService.get('STORAGE_LOCAL_PATH');

    let fileStoragePath = `${storagePath || '.local-storage'}`;

    const filePath = join(
      `${fileStoragePath}/files-storage/`,
      params.folder,
      params.name,
    );
    const folderPath = dirname(filePath);

    await this.createFolder(folderPath);

    await fs.writeFile(filePath, params.file);
  }

}