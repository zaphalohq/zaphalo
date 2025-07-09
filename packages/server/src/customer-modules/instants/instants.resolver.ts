import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { instantsService } from './instants.service';
import { WhatsappInstants } from './Instants.entity';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import { UseGuards } from '@nestjs/common';
import { UpdatedInstantsDTO } from './DTO/updated-instants';
import { DeleteInstantsDTO } from './DTO/Delete-instants';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';

@Resolver(() => WhatsappInstants)
export class instantsResolver {
    constructor(
        private readonly instantsservice: instantsService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async CreateInstants(@Context('req') req, @Args('InstantsData'
    ) WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants | null | string> {
        return await this.instantsservice.CreateInstants(WhatsappInstantsData);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async SyncAndSaveInstants(
        @Args('InstantsData') WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants | null | string> {
        const instants = await this.instantsservice.CreateInstants(WhatsappInstantsData);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.instantsservice.SyncTemplate(instants, instants?.businessAccountId, instants?.accessToken)

        }
        return instants;
    }
    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async TestAndSaveInstants(@Args('InstantsData') WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants | null | string> {
        const instants = await this.instantsservice.CreateInstants(WhatsappInstantsData);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.instantsservice.TestInstants(instants?.businessAccountId, instants?.accessToken)
        }
        return instants;
    }


    @UseGuards(GqlAuthGuard)
    @Query(() => [WhatsappInstants])
    async findAllInstants(): Promise<WhatsappInstants[]> {
        return await this.instantsservice.findAllInstants();
    }

    // @UseGuards(GqlAuthGuard)
    // @Query(() => [WhatsappInstants])
    // async findDefaultSelectedInstants(): Promise<WhatsappInstants[]> {
    //     return await this.instantsservice.findDefaultSelectedInstants();
    // }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async updateInstants(@Args('updateInstants') UpdatedInstants: UpdatedInstantsDTO): Promise<WhatsappInstants | null> {
        return this.instantsservice.UpdateInstants(UpdatedInstants.id, UpdatedInstants)
    }

        @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async SyncAndUpdateInstants(
        @Args('updateInstants') UpdatedInstants: UpdatedInstantsDTO): Promise<WhatsappInstants | null | string> {
        const instants = await this.instantsservice.UpdateInstants(UpdatedInstants.id, UpdatedInstants);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.instantsservice.SyncTemplate(instants, instants?.businessAccountId, instants?.accessToken)

        }
        return instants;
    }
    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async TestAndUpdateInstants(@Args('updateInstants') UpdatedInstants: UpdatedInstantsDTO): Promise<WhatsappInstants | null | string> {
        const instants = await this.instantsservice.UpdateInstants(UpdatedInstants.id, UpdatedInstants);
        if (instants && typeof instants !== 'string') {
            const syncTemplate = await this.instantsservice.TestInstants(instants?.businessAccountId, instants?.accessToken)
        }
        return instants;
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async DeleteInstants(@Args('DeleteInstants') DeleteInstants: DeleteInstantsDTO): Promise<WhatsappInstants | null> {
        return this.instantsservice.DeleteInstants(DeleteInstants.id)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => [WhatsappInstants])
    async InstantsSelection(@Args('instantsId') instantsId: string): Promise<WhatsappInstants[]> {
        return await this.instantsservice.InstantsSelection(instantsId);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => String)
    async sendTemplateMessage () {
        return this.instantsservice.sendTemplateMessage();
    }

}
