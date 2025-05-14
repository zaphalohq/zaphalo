import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { instantsService } from './instants.service';
import { WhatsappInstants } from './Instants.entity';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { UpdatedInstantsDTO } from './DTO/updated-instants';
import { DeleteInstantsDTO } from './DTO/Delete-instants';
import { Message } from '../channel/message.entity';

@Resolver(() => WhatsappInstants)
export class instantsResolver {
    constructor(
        @InjectRepository(WhatsappInstants, 'core')
        private readonly instantsRepository: Repository<WhatsappInstants>,        
        private readonly instantsservice: instantsService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Mutation(() => WhatsappInstants)
    async CreateInstants(@Args('InstantsData'
    ) WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants | null> {        
       return await this.instantsservice.CreateInstants(WhatsappInstantsData);
    }

    @Query(() => [WhatsappInstants])
    async findAllInstants() : Promise<WhatsappInstants[]> {
        console.log("..................");
        
        return await this.instantsservice.findAllInstants();
    }

    @Mutation(() => WhatsappInstants)
    async updateInstants(@Args('updateInstants') UpdatedInstants : UpdatedInstantsDTO): Promise<WhatsappInstants | null>{
        return this.instantsservice.UpdateInstants(UpdatedInstants.id , UpdatedInstants )
    }

    @Mutation(() => WhatsappInstants)
    async DeleteInstants(@Args('DeleteInstants') DeleteInstants : DeleteInstantsDTO) : Promise<WhatsappInstants | null> {
        return this.instantsservice.DeleteInstants(DeleteInstants.id)
    }

    @Query(() => String)
    async sendTemplateMessage () {
        return this.instantsservice.sendTemplateMessage();
    }

    @Query(() => String)
    async sendTextMessage () {
        return this.instantsservice.sendTextMessage();
    }

    @Query(() => String)
    async sendMediaMessage () {
        return this.instantsservice.sendMediaMessage();
    }
}
