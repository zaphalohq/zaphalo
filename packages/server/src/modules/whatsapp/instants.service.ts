import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappInstants } from './Instants.entity';
import { Repository } from 'typeorm';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import axios from 'axios';

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
        return await this.instantsRepository.find({
            order: { createdAt: 'ASC' }, // Sort by creation time
          });
    }

    async UpdateInstants( id : string, updatedInstants : CreateFormDataInput ): Promise<WhatsappInstants | undefined> {
        const existingInstants = await this.instantsRepository.findOne({ where : {id} });
        if (!existingInstants) {
            throw new NotFoundException(`Instant with ID ${id} not found`);
          }
        Object.assign(existingInstants, updatedInstants); // Merge input data into the existing entity

          return this.instantsRepository.save(existingInstants); // Save updated instant to the database
    }

    async DeleteInstants(id : string) : Promise<WhatsappInstants | undefined> {
        const deleteInstants = await this.instantsRepository.findOne({ where : { id }})
        return  await this.instantsRepository.remove(deleteInstants)

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



