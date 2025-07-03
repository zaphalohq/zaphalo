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
import axios from 'axios';

@Controller('fileupload1')
export class fileupload {
  constructor(
    private readonly channelservice: ChannelService,
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

//     const response = await axios({
//     url: 'https://graph.facebook.com/v22.0/565830889949112/messages',
//     method: 'POST',
//     headers: {
//         'Authorization': `Bearer ${process.env.Whatsapp_Token}`,
//         'Content-Type': 'application/json'
//     },
//     data: JSON.stringify({
//         "messaging_product": "whatsapp",
//         "to": "917202031718",
//         "type": "image",
//         "image": {
//             "link" : file,
//             "caption" : "this is image"
//         }
//     })
// })
//  console.log(file);
//  const reader = new FileReader();
//  reader.onloadend = () => {
//      console.log(reader.result);
// Logs data:<type>;base64,wL2dvYWwgbW9yZ...
//  };
//  reader.readAsDataURL(file);

    return this.channelservice.handleFileUpload(file);
  }

  @Get()
  async getMessage() {
    return "messages"
  }

  // @UseGuards(AuthGuard("jwt"))
  @Delete(':deleteFileName')
  async deleteFile(@Param('deleteFileName') deleteFileName: string) {
    await this.channelservice.deleteFile(deleteFileName);
    return {
      message: `File ${deleteFileName} deleted successfully!`
    };
  }
}