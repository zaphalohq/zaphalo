import { Inject, Injectable } from "@nestjs/common";
import DOMPurify from 'dompurify';
import FileType from 'file-type';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import { v4 } from 'uuid';
import { createReadStream, existsSync } from 'fs';
import * as fs from 'fs/promises';
import { dirname, join } from 'path';
import { Readable } from 'stream';

import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { FileStorageService } from 'src/modules/file-storage/file-storage.service';
import { ConfigService } from '@nestjs/config';
import { buildFileInfo } from 'src/modules/file/utils/build-file-info.utils';
import { FileService } from 'src/modules/file/services/file.service';
import { FileFolder } from 'src/modules/file/interfaces/file-folder.interface';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly fileStorage: FileStorageService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService
  ) { }

  private async _uploadFile({
    file,
    filename,
    mimeType,
    folder,
  }: {
    file: Buffer | Uint8Array | string;
    filename: string;
    mimeType: string | undefined;
    folder: string;
  }) {
    await this.fileStorage.write({
      file,
      name: filename,
      mimeType,
      folder,
    });
  }

  private _sanitizeFile({
    file,
    ext,
    mimeType,
  }: {
    file: Buffer | Uint8Array | string;
    ext: string;
    mimeType: string | undefined;
  }): Buffer | Uint8Array | string {
    if (ext === 'svg' || mimeType === 'image/svg+xml') {
      const window = new JSDOM('').window;
      const purify = DOMPurify(window);

      return purify.sanitize(file.toString());
    }

    return file;
  }


  async uploadFile({
    file,
    filename,
    mimeType,
    fileFolder,
    workspaceId,
  }: {
    file: Buffer | Uint8Array | string;
    filename: string;
    mimeType: string | undefined;
    fileFolder: FileFolder;
    workspaceId: string;
  }) {
    const { ext, name } = buildFileInfo(filename);
    const folder = this.getWorkspaceFolderName(workspaceId, fileFolder);

    const res = await this._uploadFile({
      file: this._sanitizeFile({ file, ext, mimeType }),
      filename: name,
      mimeType,
      folder,
    });

    const signedPayload = this.fileService.encodeFileToken({
      filename: name,
      workspaceId: workspaceId,
    });

    return {
      filename: name,
      originalname: filename,
      mimetype: mimeType,
      size: file.length,
      path: `${fileFolder}/${name}`,
      // files: [{ path: `${fileFolder}/${name}`, token: signedPayload }],
    };
  }


  private getWorkspaceFolderName(workspaceId: string, fileFolder: string) {
    return `workspace-${workspaceId}/${fileFolder}`;
  }
}