import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TemplateService } from './template.service';
import { instantsService } from '../instants/instants.service';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';


@Controller('templateFileUpload')
export class TemplateFileUpload {
    constructor(
        private readonly templateService: TemplateService,
        private readonly instantsService: instantsService
    ) { }

    @Post()
    @UseGuards(GqlAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cd) => {
                    cd(null, `${Date.now()}-${file.originalname}`)
                }
            }),
            limits: { fileSize: 5 * 1024 * 1024 }
        }))
        
    async FileUpload(@Req() req, @UploadedFile() file: Express.Multer.File) {
        const workspaceId = req.user.workspaceIds[0];
        const findSelectedInstants = await this.instantsService.FindSelectedInstants()
        if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
        const appId = findSelectedInstants?.appId
        const accessToken = findSelectedInstants?.accessToken
        const file_handle = await this.templateService.uploadFile(file, appId, accessToken);
        return { file_handle, fileUrl: `${process.env.SERVER_URL}/${file.filename}` }

    }
}