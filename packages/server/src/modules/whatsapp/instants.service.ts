import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappInstants } from './Instants.entity';
import { Repository, ReturningStatementNotSupportedError } from 'typeorm';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import { log } from 'console';

@Injectable()
export class instantsService {
    constructor (
         @InjectRepository(WhatsappInstants, 'core')                // Inject User repository
            private instantsRepository: Repository<WhatsappInstants>
    ) {}

    async CreateInstants(WhatsappInstantsData : CreateFormDataInput): Promise<WhatsappInstants | undefined>{
        console.log(WhatsappInstantsData);
        
        const whatappInstants =  this.instantsRepository.create(WhatsappInstantsData)
        await this.instantsRepository.save(whatappInstants)
        return whatappInstants;
    }

    async findAllInstants(): Promise<WhatsappInstants[]> {
        console.log("...............");
        
        return await this.instantsRepository.find();
    }

}


