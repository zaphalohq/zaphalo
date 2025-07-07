import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from '@nestjs/common';
import graphqlTypeJson from 'graphql-type-json';


import { WhatsAppAccount } from './whatsapp-account.entity';
import { WhatsAppAccountService } from './services/whatsapp-account.service';
import { WhatsAppSDKService } from './services/whatsapp-api.service'
import { instantsService } from "src/customer-modules/instants/instants.service";
import { WhatsappInstants } from 'src/customer-modules/instants/Instants.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';


@Resolver(() => WhatsappInstants)
export class WhatsAppResolver {
  // constructor(
  //   private readonly whatsAppApiService: WhatsAppSDKService,
  //   private readonly instantsService: instantsService) { }

   constructor(
      private readonly whatsAppAccountService: WhatsAppAccountService,
      private readonly whatsAppApiService: WhatsAppSDKService,
      private readonly instantsService: instantsService
    ) { }


  // @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async testConnection(
    @Context('req') req,
  ): Promise<String> {
    const findTrueInstants = await this.instantsService.FindSelectedInstants()

    if (!findTrueInstants)
      throw new Error("Not found whatsappaccount")

    const wa_api = this.whatsAppApiService.getWhatsApp(findTrueInstants)

    try{
      wa_api._test_connection()
    }
    catch(err){
      return "{'status': 401, 'error': 'Credentials not look good!'}"
    }

    return "{'status': 200, 'message': 'Credentials look good!'}"
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [WhatsAppAccount])
  async findAllWhatsAppAccounts(): Promise<WhatsAppAccount[]> {
      return await this.whatsAppAccountService.findAllAccounts();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => graphqlTypeJson)
  async getAllWhatsAppTemplates(){
     const findTrueInstants = await this.instantsService.FindSelectedInstants()

    if (!findTrueInstants)
      throw new Error("Not found whatsappaccount")

    const wa_api = this.whatsAppApiService.getWhatsApp(findTrueInstants)
    const data = await wa_api.getAllTemplate();
    return data;
  }


}