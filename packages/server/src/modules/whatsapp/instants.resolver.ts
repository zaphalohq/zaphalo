import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { instantsService } from './instants.service';
import { WhatsappInstants } from './Instants.entity';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';

@Resolver(() => WhatsappInstants)
export class instantsResolver {
    constructor(
        @InjectRepository(WhatsappInstants, 'core')
        private readonly instantsRepository: Repository<WhatsappInstants>,
        // private readonly instantsservice: instantsService,
        private readonly instantsservice: instantsService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Mutation(() => WhatsappInstants)
    async CreateInstants(@Args('InstantsData'
    ) WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants> {        
       return await this.instantsservice.CreateInstants(WhatsappInstantsData);
    }
}
