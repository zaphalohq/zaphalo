import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import fs from 'fs/promises';

import { WhatsAppAccountService } from 'src/customer-modules/whatsapp/services/whatsapp-account.service';
import { WhatsAppSDKService } from 'src/customer-modules/whatsapp/services/whatsapp-api.service'
import { instantsService } from "src/customer-modules/instants/instants.service";
import { WhatsappInstants } from 'src/customer-modules/instants/Instants.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';

@Controller('whatsapp')
export class WhatsAppController {
    constructor(
		private readonly whatsAppAccountService: WhatsAppAccountService,
      	private readonly whatsAppApiService: WhatsAppSDKService,
      	private readonly instantsService: instantsService
    ) { }

    @Post('/upload')
    @UseGuards(GqlAuthGuard)
    @UseInterceptors(FileInterceptor('attachment', {
      storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cd) => {
              cd(null, `${Date.now()}-${file.originalname}`)
          }
      }),
      limits: { fileSize: 5 * 1024 * 1024 }
    }))
    async uploadFile(@Req() req, @UploadedFile() attachment: Express.Multer.File) {
      const workspaceId = req.user.workspaceIds[0];
      const defaultWAConfig = await this.instantsService.FindSelectedInstants()
      if (!defaultWAConfig)
      	throw new Error('WhatsApp Configration not found');

      const wa_api = this.whatsAppApiService.getWhatsApp(defaultWAConfig)
    	const data = await wa_api.uploadDemoDocument(attachment);
    	return data
    }
}