import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';

@Controller('upload')
export class UploadController {
  
  @Post()
  @UseGuards(GqlAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @AuthWorkspace() workspace: Workspace,
    @Req() req,
    @UploadedFile() file: Express.Multer.File) {

    return {
      message: 'File uploaded successfully',
      file,
    };
  }
}