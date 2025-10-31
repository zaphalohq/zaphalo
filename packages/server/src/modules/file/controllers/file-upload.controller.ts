import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { FileUploadService } from 'src/modules/file/services/file-upload.service';
import { diskStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @AuthWorkspace() workspace: Workspace,
    @Req() req,
    @UploadedFile() file: Express.Multer.File) {
    const workspaceFolderPath = `workspace-${workspace.id}`;

    const url = await this.fileUploadService.uploadFile({
      file: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
      fileFolder: 'attachment',
      workspaceId: workspace.id,
    })

    return {
      message: 'File uploaded successfully',
      file: url,
    };
  }
}