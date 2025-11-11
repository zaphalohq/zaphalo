import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Body,
  UseGuards
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { FileUploadService } from 'src/modules/file/services/file-upload.service';
import { toFileFolderType } from 'src/modules/file/interfaces/file-folder.interface';


@Controller('upload')
export class UploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @AuthWorkspace() workspace: Workspace,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('fileFolder') fileFolder: string) {

    const url = await this.fileUploadService.uploadFile({
      file: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
      fileFolder: toFileFolderType(fileFolder),
      workspaceId: workspace.id,
    })

    return {
      message: 'File uploaded successfully',
      file: url,
    };
  }
}