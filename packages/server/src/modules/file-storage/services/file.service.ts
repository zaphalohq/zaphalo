import { Inject, Injectable } from "@nestjs/common";

import { createReadStream, existsSync } from 'fs';
import * as fs from 'fs/promises';
import { dirname, join } from 'path';
import { Readable } from 'stream';

import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';

@Injectable()
export class FileService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
  ) { }

  async getFileStream(params: {
    folderPath: string;
    filename: string;
  }): Promise<Readable> {
    const filePath = join(process.cwd(),
  `uploads/`,
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

}