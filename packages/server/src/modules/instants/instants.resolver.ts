import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { instantsService } from './instants.service';
import { WhatsappInstants } from './Instants.entity';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { UpdatedInstantsDTO } from './DTO/updated-instants';
import { DeleteInstantsDTO } from './DTO/Delete-instants';
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { stringify } from 'node:querystring';

@Resolver(() => WhatsappInstants)
export class instantsResolver {
    constructor(
        @InjectRepository(WhatsappInstants, 'core')
        private readonly instantsRepository: Repository<WhatsappInstants>,
        private readonly instantsservice: instantsService,
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async CreateInstants(@Context('req') req, @Args('InstantsData'
    ) WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants | null | string> {
        const workspaceId = req.headers['x-workspace-id']
        return await this.instantsservice.CreateInstants(WhatsappInstantsData, workspaceId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async SyncAndSaveInstants(@Context('req') req, @Args('InstantsData'
    ) WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants | null | string> {
        const workspaceId = req.headers['x-workspace-id']
        const instants = await this.instantsservice.CreateInstants(WhatsappInstantsData, workspaceId);
        console.log(instants && typeof instants !== 'string');
        
        if (instants && typeof instants !== 'string') {
        // const syncTemplate =  await this.instantsservice.SyncTemplate(instants?.appId, instants?.accessToken)
        // console.log(syncTemplate,"..............................");
        
        }
        return instants;
    }



    @UseGuards(GqlAuthGuard)
    @Query(() => [WhatsappInstants])
    async findAllInstants(@Context('req') req): Promise<WhatsappInstants[]> {
        const workspaceId = req.headers['x-workspace-id']
        return await this.instantsservice.findAllInstants(workspaceId);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async updateInstants(@Args('updateInstants') UpdatedInstants: UpdatedInstantsDTO): Promise<WhatsappInstants | null> {
        return this.instantsservice.UpdateInstants(UpdatedInstants.id, UpdatedInstants)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => WhatsappInstants)
    async DeleteInstants(@Args('DeleteInstants') DeleteInstants: DeleteInstantsDTO): Promise<WhatsappInstants | null> {
        return this.instantsservice.DeleteInstants(DeleteInstants.id)
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => [WhatsappInstants])
    async InstantsSelection(@Context('req') req, @Args('instantsId') instantsId: string): Promise<WhatsappInstants[]> {
        const workspaceId = req.headers['x-workspace-id']
        return await this.instantsservice.InstantsSelection(instantsId, workspaceId);
    }


    @Query(() => String)
    async sendTemplateMessage() {
        return this.instantsservice.sendTemplateMessage();
    }

    @Query(() => String)
    async sendTextMessage() {
        return this.instantsservice.sendTextMessage();
    }

    @Query(() => String)
    async sendMediaMessage() {
        return this.instantsservice.sendMediaMessage();
    }
}
