import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WaAccountService } from '../services/whatsapp-account.service';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { WaAccountDto } from '../dtos/whatsapp-account-update.dto';


@Resolver(() => WhatsAppAccount)
export class WaAccountResolver {
    constructor(
        private readonly waAccountService: WaAccountService,
                          
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppAccount)
    async WaAccountSave(
        @Context('req') req : Request,
        @Args('whatsappInstantsData') whatsappInstantsData: WaAccountDto,
        @Args('instanceId', { nullable: true}) instanceId?: string
    ): Promise<WhatsAppAccount | null> {
        if (!instanceId) {
            return await this.waAccountService.WaAccountCreate(req, whatsappInstantsData);
        } else {
            return await this.waAccountService.UpdateInstants(instanceId, whatsappInstantsData);
        }
    }
    
    @UseGuards(GqlAuthGuard)
    @Query(() => [WhatsAppAccount])
    async findAllInstants(): Promise<WhatsAppAccount[]> {
        return await this.waAccountService.findAllAccounts();
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

}
