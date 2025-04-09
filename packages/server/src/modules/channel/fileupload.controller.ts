import { Body, Controller, Get, Post, UploadedFiles, Request, UseGuards, UseInterceptors, UploadedFile, Delete, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelService } from './channel.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { log } from 'console';

@Controller('fileupload')
export class fileupload {
    constructor(
        @InjectRepository(Channel, 'core')
        private readonly channelRepository: Repository<Channel>,
        // @InjectRepository(Message, 'core')
        private readonly channelservice: ChannelService,
    ) { }

    // fileArray.forEach(file => {
    //     formData.append('files', file); // Note: 'files' matches the interceptor field name
    //   });
    @UseInterceptors(
        FileInterceptor('file',{
            storage : diskStorage({
                destination : './uploads',
                filename : (req, file, cd) => {
                    cd(null, `${Date.now()}-${file.originalname}`)
                }
            }),
            limits: { fileSize: 10 * 1024 * 1024 } 
        })
    )
    @Post()
    // @UseGuards(AuthGuard("jwt"))
    async FileUpload(@UploadedFile() file: Express.Multer.File): Promise<string>{
        console.log(file);
        
        return this.channelservice.handleFileUpload(file);
      }

    @Get()
    async getMessage()  {
        return "messages"
    }

    // @UseGuards(AuthGuard("jwt"))
    @Delete(':deleteFileName')
    async deleteFile(@Param('deleteFileName') deleteFileName: string) {
        console.log(deleteFileName);
        
        await this.channelservice.deleteFile(deleteFileName);
        return {
            message: `File ${deleteFileName} deleted successfully!`
        };
    }

}