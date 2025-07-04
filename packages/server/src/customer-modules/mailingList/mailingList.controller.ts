import { 
    Controller, 
    Post, 
    UseGuards, 
    UseInterceptors, 
    UploadedFile, 
    Req } from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { MailingListService } from './mailingList.service';
import * as XLSX from 'xlsx';
import { Request } from 'express';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';

@Controller('uploadExcel')
export class MailingListController {
    constructor(
        private readonly mailingListService: MailingListService,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(GqlAuthGuard)    
    async uploadExcel(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const mailingListData: any = XLSX.utils.sheet_to_json(worksheet);
        return this.mailingListService.CreateMailingList({ mailingContacts: mailingListData });
    }
}