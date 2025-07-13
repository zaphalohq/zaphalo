import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { Response } from 'express';

import { FilePathGuard } from 'src/modules/file-storage/guards/file-path-guard';
import { FileService } from 'src/modules/file-storage/services/file.service';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';

@Controller('files')
@UseGuards(FilePathGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:filename')
  async getFile(
    @Param() params: string[],
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const filename = params['filename']

    const workspaceId = (req as any)?.workspaceId;


    const workspaceFolderPath = `workspace-${workspaceId}`;

    if (!workspaceId) {
      throw new Error(
        'Unauthorized: missing workspaceId',
      );
    }

    try {
      const fileStream = await this.fileService.getFileStream({
        folderPath: workspaceFolderPath,
        filename: filename,}
      );
      
      fileStream.on('error', () => {
        throw new Error(
          'Error streaming file from storage',
        );
      });

      fileStream.pipe(res);
    } catch (error) {
      throw new Error(
        `Error retrieving file: ${error.message}`,
      );
    }
  }
}
