import { Controller, Get, Post, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadService } from './fileUpload.service';
import { Channel } from 'diagnostics_channel';


@Controller('fileupload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
  ) { }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cd) => {
          cd(null, `${Date.now()}-${file.originalname}`)
        }
      }),
      limits: { fileSize: 10 * 1024 * 1024 }
    })
  )

  @Post()
    // @UseGuards(AuthGuard("jwt"))
  async FileUpload(@UploadedFile() file: Express.Multer.File): Promise<string> {
    console.log(file);

    return this.fileUploadService.handleFileUpload(file);
  }

  @Get()
  async getMessage() {
    return "messages"
  }

  // @UseGuards(AuthGuard("jwt"))
  @Delete(':deleteFileName')
  async deleteFile(@Param('deleteFileName') deleteFileName: string) {
    await this.fileUploadService.deleteFile(deleteFileName);
    return {
      message: `File ${deleteFileName} deleted successfully!`
    };
  }
}