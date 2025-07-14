import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WaAccountService } from '../services/whatsapp-account.service';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';
import { UseGuards } from '@nestjs/common';
import { WaAccountUpdateDTO } from '../dtos/whatsapp-account-update.dto';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';


@Resolver(() => WhatsAppAccount)
export class WaAccountResolver {
    constructor(
        private readonly waAccountService: WaAccountService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppAccount)
    async WaAccountCreate(
        @Context('req') req,
        @Args('waAccount') waAccount: WaAccountUpdateDTO
    ): Promise<WhatsAppAccount> {
        return await this.waAccountService.WaAccountCreate(waAccount);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppAccount)
    async SyncAndSaveInstants(
        @Args('InstantsData') WhatsappInstantsData: WaAccountUpdateDTO): Promise<WhatsAppAccount | null | string> {
        const instants = await this.waAccountService.WaAccountCreate(WhatsappInstantsData);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.waAccountService.SyncTemplate(instants, instants?.businessAccountId, instants?.accessToken)

        }
        return instants;
    }
    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppAccount)
    async TestAndSaveInstants(@Args('InstantsData') WhatsappInstantsData: WaAccountUpdateDTO): Promise<WhatsAppAccount | null | string> {
        const instants = await this.waAccountService.WaAccountCreate(WhatsappInstantsData);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.waAccountService.TestInstants(instants?.businessAccountId, instants?.accessToken)
        }
        return instants;
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
    async updateInstants(@Args('updateInstants') UpdatedInstants: WaAccountUpdateDTO): Promise<WhatsAppAccount | null> {
        return this.waAccountService.UpdateInstants(UpdatedInstants.id, UpdatedInstants)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppAccount)
    async SyncAndUpdateInstants(
        @Args('updateInstants') UpdatedInstants: WaAccountUpdateDTO): Promise<WhatsAppAccount | null | string> {
        const instants = await this.waAccountService.UpdateInstants(UpdatedInstants.id, UpdatedInstants);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.waAccountService.SyncTemplate(instants, instants?.businessAccountId, instants?.accessToken)

        }
        return instants;
    }
    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsAppAccount)
    async TestAndUpdateInstants(@Args('updateInstants') UpdatedInstants: WaAccountUpdateDTO): Promise<WhatsAppAccount | null | string> {
        const instants = await this.waAccountService.UpdateInstants(UpdatedInstants.id, UpdatedInstants);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.waAccountService.TestInstants(instants?.businessAccountId, instants?.accessToken)
        }
        return instants;
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
    @Query(() => String)
    async sendTemplateMessage () {
        return this.waAccountService.sendTemplateMessage();
    }
}
