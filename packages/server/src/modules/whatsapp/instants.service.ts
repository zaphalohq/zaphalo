import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappInstants } from './Instants.entity';
import { Repository } from 'typeorm';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import axios from 'axios';
import { WorkspaceService } from '../workspace/workspace.service';
import { ContactsService } from '../contacts/contacts.service';

@Injectable()
export class instantsService {
    constructor (
        @InjectRepository(WhatsappInstants, 'core')                // Inject User repository
        private instantsRepository: Repository<WhatsappInstants>,
        private readonly workspaceService: WorkspaceService,
        private readonly contactsService: ContactsService,
    ) {}

    async CreateInstants(WhatsappInstantsData : CreateFormDataInput, workspaceId: string): Promise<WhatsappInstants | null>{
        console.log(WhatsappInstantsData);
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")

        const instants = await this.instantsRepository.find({ where : { id : workspaceId}});
        console.log(instants.length,"...............................");
        
        let defaultSelected = false;
        if(instants.length < 1){
            defaultSelected = true
        }
        const whatappInstants =  this.instantsRepository.create({
            name : WhatsappInstantsData.name,
            appId : WhatsappInstantsData.appId,
            phoneNumberId : WhatsappInstantsData.phoneNumberId,
            businessAccountId : WhatsappInstantsData.businessAccountId,
            accessToken : WhatsappInstantsData.accessToken,
            appSecret : WhatsappInstantsData.appSecret,
            workspace,
            defaultSelected : defaultSelected
        })
        await this.contactsService.createContacts({
          contactName : WhatsappInstantsData.name,
          phoneNo : Number(WhatsappInstantsData.phoneNumberId),
          defaultContact : true,
        }, workspaceId )
        await this.instantsRepository.save(whatappInstants)
        return whatappInstants;
    }

    async findAllInstants(workspaceId : string): Promise<WhatsappInstants[]> {
        return await this.instantsRepository.find({
            where: { workspace : { id: workspaceId}},
            order: { createdAt: 'ASC' }, // Sort by creation time
          });
    }

    async UpdateInstants( id : string, updatedInstants : CreateFormDataInput ): Promise<WhatsappInstants | null> {
        const existingInstants = await this.instantsRepository.findOne({ where : {id} });
        if (!existingInstants) {
            throw new NotFoundException(`Instant with ID ${id} not found`);
          }
        Object.assign(existingInstants, updatedInstants); // Merge input data into the existing entity

          return this.instantsRepository.save(existingInstants); // Save updated instant to the database
    }

    async DeleteInstants(id : string) : Promise<WhatsappInstants | null> {
        const deleteInstants = await this.instantsRepository.findOne({ where : { id }});
        if (deleteInstants)
            return  await this.instantsRepository.remove(deleteInstants)
        else
            return null

    }

    async InstantsSelection(instantsId : string, workspaceId : string){
        const findSelectedInstants = await this.FindSelectedInstants(workspaceId)

        await this.instantsRepository.update(
            { id : findSelectedInstants?.id },
            { defaultSelected : false }
        )
        await this.instantsRepository.update(
            { id : instantsId },
            { defaultSelected : true }
        )
        return await this.findAllInstants(workspaceId)
    }

    
    async FindSelectedInstants(workspaceId) {
        return this.instantsRepository.findOne({
            where : { defaultSelected : true,
                      workspace : { id : workspaceId }
                }});
    }

    async whatsappApiPost(data){
        return  await axios({            
            url:'https://graph.facebook.com/v22.0/565830889949112/messages',
            method:'POST',
            headers:{
                'Authorization':'Bearer EAAao8Mkc6lMBOw89Nyjm1wZAZCu22JyY7KQibodfgbLsznrLIeZCvCadGUr5kKZBR8ZAoHsmtvAM0Vfa0FHQI1Ue7XMZCZCjxKp5X7ZBCe4NpaYGfE9nbwDbZB8XGGNn1EHBdJzgO49qEmafyS5twKTLMEY8WO4aZCZAaid2qVrsY1OIi6IA4Ly4ppkYllVDdkQ6oasLCx6Ergb6i05HusJeoDAysXhlT2unJUQdKJh',
                'Content-Type' : 'application/json'
            },
            data: JSON.stringify(data)
        })
    }

    async sendTemplateMessage() {
        const response = this.whatsappApiPost({
                "messaging_product": "whatsapp",
                "to": "917202031718",
                "type": "template",
                "template": {
                    "name": "hello_world",
                    "language": {
                        "code": "en_US"
                    }
                }
            })
            console.log(response);
            
            return "response"
        }

    async sendTextMessage() {
        const response =   this.whatsappApiPost({
                "messaging_product": "whatsapp",
                "to": "917202031718",
                "type": "text",
                "text": {
                    'body' : "this is the text message"
                }
            })
            console.log(response);
            return "response";
        }

    async sendMediaMessage() {
        const response = this.whatsappApiPost({
                "messaging_product": "whatsapp",
                "to": "917202031718",
                "type": "image",
                "image": {
                    "link" : "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
                    "caption" : "this is image"
                }
            })
            console.log(response);
            return "response"
    }

}



