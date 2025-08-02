import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Body,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { FileInterceptor, } from '@nestjs/platform-express';
import { MailingListService } from './mailingList.service';
import * as XLSX from 'xlsx';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';

@Controller('uploadExcel')
export class MailingListController {
    constructor(
        private readonly mailingListService: MailingListService,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(GqlAuthGuard)
    async uploadExcel(@UploadedFile() file: Express.Multer.File, @Body('mailingListName') mailingListName: string,) {
        const existingMailingList = await this.mailingListService.findMailingListByName(mailingListName);
        if (existingMailingList) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: "mailing list with the same name already exists. Please try a different name.",
                    errorCode: "DUPLICATE_MAILING_LIST"
                },
                HttpStatus.BAD_REQUEST
            );
        }

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const mailingListData: any = XLSX.utils.sheet_to_json(worksheet);

        const rawData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = rawData[0] || [];
        const totalColumns = headers.length;
        const firstColumnName = headers[0];
        const secondColumnName = headers[1];
        if (totalColumns === 2 && firstColumnName === 'contactName' && secondColumnName === 'contactNo') {
            return this.mailingListService.CreateMailingList(mailingListName, { mailingContacts: mailingListData });
        } else {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    message: "please provide a valid excel sheet in correct format.",
                    errorCode: "INCORRECT_FORMATE_MAILING_LIST"
                },
                HttpStatus.BAD_REQUEST
            );
        }


    }
}