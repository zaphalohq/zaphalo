import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WaAccountService } from '../services/whatsapp-account.service';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { WaAccountDto } from '../dtos/whatsapp-account-update.dto';
import { WaTemplateService } from 'src/customer-modules/whatsapp/services/whatsapp-template.service';
import { WhatsAppSDKService } from 'src/customer-modules/whatsapp/services/whatsapp-api.service'
import { Workspace } from "src/modules/workspace/workspace.entity";
import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { SuccessResponse } from "../dtos/success.dto";
import { ManyAccountResponse } from '../dtos/many-WAaccount-response';


@Resolver(() => WhatsAppAccount)
export class WaAccountResolver {
  constructor(
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,
  ) { }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WhatsAppAccount)
  async WaAccountCreate(
    @Context('req') req : Request,
    @Args('whatsAppAccountData') whatsAppAccountData: WaAccountDto,
  ): Promise<WhatsAppAccount | null> {
    if (whatsAppAccountData.accountId) {
      throw Error("WhatsApp Account all ready created!")
    }
    return await this.waAccountService.WaAccountCreate(req, whatsAppAccountData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WhatsAppAccount)
  async WaAccountSave(
    @Context('req') req : Request,
    @Args('whatsAppAccountData') whatsAppAccountData: WaAccountDto
  ): Promise<WhatsAppAccount | null> {
    if (!whatsAppAccountData.accountId) {
      throw Error("WhatsApp account ID not provided!")
    }
    return await this.waAccountService.WaAccountSave(whatsAppAccountData);
  }
  
  @UseGuards(GqlAuthGuard)
  @Query(() => ManyAccountResponse)
  async searchReadAccount(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('pageSize', { type: () => Int, defaultValue: 10 }) pageSize: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    if (!search)
      search = ''
    
    return await this.waAccountService.searchReadAccounts(page, pageSize, search)
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => WhatsAppAccount)
  async getWaAccount(
    @Args('waAccountId') waAccountId:string,
  ){
    return await this.waAccountService.findInstantsByInstantsId(waAccountId)
  }


  @UseGuards(GqlAuthGuard)
  @Query(() => WhatsAppAccount)
  async findDefaultSelectedInstants(): Promise<WhatsAppAccount | null> {
    return await this.waAccountService.FindSelectedInstants();
  }


  @UseGuards(GqlAuthGuard)
  @Mutation(() => WhatsAppAccount)
  async DeleteInstants(@Args('waAccountId') waAccountId: string): Promise<WhatsAppAccount | null> {
    return this.waAccountService.DeleteInstants(waAccountId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => [WhatsAppAccount])
  async InstantsSelection(@Args('instantsId') instantsId: string): Promise<WhatsAppAccount[]> {
    return await this.waAccountService.InstantsSelection(instantsId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WhatsAppAccount)
  async WaAccountSync(
    @Context('req') req,
    @Args('whatsAppAccountData') waAccount: WaAccountDto,
  ): Promise<WhatsAppAccount | null | string> {
    if (!waAccount.accountId) {
      throw Error("WhatsApp account id not provided")
    }

    const WaAccounts = await this.waAccountService.findInstantsByInstantsId(waAccount.accountId)
    const wa_api = await this.waAccountService.getWhatsAppApi(waAccount.accountId)
    if (WaAccounts) {
      const syncTemplate = await wa_api.syncTemplate();
      await this.waAccountService.saveSyncTemplates(syncTemplate, WaAccounts)
    }
    return WaAccounts;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SuccessResponse)
  async WaAccountTestConnection(
    @AuthWorkspace() workspace: Workspace,
    @Context('req') req,
    @Args('whatsAppAccountData') waAccount: WaAccountDto,
  ): Promise<SuccessResponse | undefined> {
    if (!waAccount.accountId) {
      throw Error("WhatsApp account id not provided")
    }
    const WaAccounts = await this.waAccountService.findInstantsByInstantsId(waAccount.accountId)

    if (!WaAccounts) {
      throw Error("WhatsApp account id provided is wrong.")
    }

    const wa_api = await this.waAccountService.getWhatsAppApi(waAccount.accountId)
    const res = await wa_api._test_connection()
    return {
      success: true,
      message: res,
    }
  }

  @Query(() => [WhatsAppAccount])
  async readWaAccount(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<WhatsAppAccount[] | undefined> {
    const waAccounts = await this.waAccountService.readWaAccount(search, limit);
    return waAccounts
  }


}
