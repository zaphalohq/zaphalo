import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingListService } from "./mailingList.service";
import { MailingContact } from "./DTO/MailingListReqDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { SuccessResponse } from "../whatsapp/dtos/success.dto";
import { MailingContacts } from "./mailingContacts.entity";
import { SelectedMailingContactResDto } from "./DTO/SelectedMailingContactResDto";
import { FindAllMailingListRes } from "./DTO/FindAllMailingListDto";
import { SearchedRes } from "../whatsapp/dtos/searched.dto";
import { MailingContactResDto } from "./DTO/MailingContactResDto";
import { UploadExcelResponse } from "./DTO/UploadExcelResponse.dto";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { Workspace } from "src/modules/workspace/workspace.entity";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { streamToBuffer } from "src/utils/stream-to-buffer";
import * as XLSX from 'xlsx';


@Resolver(() => MailingList)
export class MailingListResolver {
  constructor(
    private readonly mailingListService: MailingListService,
  ) { }


  @Query(() => FindAllMailingListRes)
  @UseGuards(GqlAuthGuard)
  async searchReadMailingList(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('filter', { type: () => String, nullable: true }) filter?: string,
  ): Promise<FindAllMailingListRes> {
    if (!search)
      search = ''
    if (!filter)
      filter = ''

    const response = await this.mailingListService.searchReadMailingList(page, pageSize, search, filter)
    return response
  }

  @Query(() => SelectedMailingContactResDto)
  @UseGuards(GqlAuthGuard)
  async findAllMailingContacts(
    @Args('mailingListId') mailingListId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ): Promise<SelectedMailingContactResDto> {
    if (!search)
      search = ''
    return await this.mailingListService.findAllContactsOfMailingList(mailingListId, page, pageSize, search);
  }

  @Query(() => MailingContacts, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async findMailingContact(
    @Args('mailingContactId') mailingContactId: string,
  ): Promise<MailingContacts | null> {
    return await this.mailingListService.findMailingContactByContactId(mailingContactId)
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(GqlAuthGuard)
  async saveMailingContact(@Args('saveMailingContact') saveMailingContact: MailingContact) {
    await this.mailingListService.saveMailingContact(saveMailingContact)
    return {
      success: true,
      message: 'contact saved successfully'
    }
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(GqlAuthGuard)
  async deleteMailingListWithAllContacts(@Args('mailingIds', { type: () => [String] }) mailingListIds: string[]) {
    return this.mailingListService.deleteMailingWithContacts(mailingListIds)
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(GqlAuthGuard)
  async deleteMailingContact(@Args('mailingContactIds', { type: () => [String] }) mailingContactIds: string[]) {
    return await this.mailingListService.deleteMailingContact(mailingContactIds)
  }

  @Query(() => SearchedRes)
  async searchMailingList(
    @Args('searchTerm', { type: () => String, nullable: true }) searchTerm?: string,
  ): Promise<SearchedRes | null> {
    return this.mailingListService.searchMailingList(searchTerm);
  }

  @Query(() => [MailingList])
  async readMailingList(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<MailingList[] | undefined> {
    const mailigList = await this.mailingListService.readMailingList(search, limit);
    return mailigList
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UploadExcelResponse)
  async uploadExcel(
    @AuthWorkspace() { id: workspaceId }: Workspace,
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream }: FileUpload,
    @Args('mailingListName') mailingListName: string,
  ) {

    const stream = createReadStream();
    const buffer = await streamToBuffer(stream);

    const existingMailingList = await this.mailingListService.findMailingListByName(mailingListName);
    if (existingMailingList) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: "Contact List with the same name already exists. Please try a different name.",
          errorCode: "DUPLICATE_MAILING_LIST"
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName]
    const mailingListData: any = XLSX.utils.sheet_to_json(worksheet);

    const rawData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = rawData[0] || [];
    const totalColumns = headers.length;
    const firstColumnName = headers[0];
    const secondColumnName = headers[1];

    // Validate format
    if (
      totalColumns !== 2 ||
      firstColumnName !== 'contactName' ||
      secondColumnName !== 'contactNo'
    ) {
      throw new Error(
        'Please provide a valid excel sheet in correct format (contactName, contactNo)',
      );
    }
    else {
      const mailingList = await this.mailingListService.CreateMailingList(mailingListName, { mailingContacts: mailingListData });
      if (mailingList) {
        return {
          success: true,
          message: 'Contact List is created'
        }
      }
      else {
        throw new Error("Failed to create Contact List")
      }

    }
  }

}

