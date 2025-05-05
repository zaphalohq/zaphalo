import { Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "./channel.entity";
import { Message } from "./message.entity";
import { ContactsService } from "../contacts/contacts.service";
import { UserService } from "../user/user.service";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";
import axios, { AxiosResponse } from "axios"
import fs from "fs"
import { WorkspaceService } from "../workspace/workspace.service";
// import { TemplateRequestInput } from "./dto/TemplateRequestInput";

interface TemplateComponent {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    text?: string;
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    buttons?: Array<{
      type: 'QUICK_REPLY' | 'PHONE_NUMBER' | 'URL';
      text: string;
      phone_number?: string;
      url?: string;
    }>;
  }
  
  interface TemplateRequest {
    name: string;
    category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
    language: string;
    components: TemplateComponent[];
  }

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel, 'core')
        private channelRepository: Repository<Channel>,
        @InjectRepository(Message, 'core')
        private messageRepository: Repository<Message>,
        private readonly contactsservice: ContactsService,
        private readonly userService: UserService,
        private readonly workspaceService: WorkspaceService,
        // Use an absolute path relative to the module's location
    // private readonly uploadDir = './uploads'
    ) { }


    async findOrCreateChannel(phoneNo: any, memberIds: number[],workspaceId : string, channelName?: string, userId?: any, ) {        
        const contacts = await this.contactsservice.findContactsByPhoneNoArr(memberIds, workspaceId)

        //----finding channel exist or not ------------------------
        const isChannelExist = await this.findExistingChannelByPhoneNo(memberIds, workspaceId)
        console.log(isChannelExist,"isChannelExist...................isChannelExist");
        
        if (isChannelExist && isChannelExist.channelName)
            return {channel : isChannelExist , newChannelCreated : false }
        const user = await this.userService.findByUserId(userId)
        if (!user) throw new Error("user doesnt found")
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")
        const newChannel = this.channelRepository.create({
            channelName: channelName || phoneNo, // Default name as phoneNo
            contacts: contacts,
            writeUser: user,
            createUser: user,
            membersidsss: JSON.stringify(memberIds),
            workspace : workspace,
        })
        await this.channelRepository.save(newChannel)
        // console.log('thi siis memebrs ids', memberIds);
        console.log(newChannel,"..................................ds.ds.......................");
        
        return {channel : newChannel, newChannelCreated : true}
    }

    async findExistingChannelByPhoneNo(memberIds: any, workspaceId : string): Promise<Channel | undefined> {
        const channelExist = await this.channelRepository.find({
            where: { contacts: memberIds.map((member) => ({ phoneNo: member })), workspace : { id : workspaceId} },
            relations: ['contacts','workspace']
        })
        // console.log(channelExist, "this is the one channelExistst ");
        //------------this is for messaging to own number------------
        // if(memberIds.length === 2 && memberIds[0] === memberIds[1]){
        //     const defaultChannel = await this.channelRepository.findOne({
        //         where : { channelName : 'default No'}
        //     })
        //     return defaultChannel || undefined
        // } else { }
        // console.log(channelExist,"..............channelExist......................");
        
        const membersIdsStr = memberIds.sort((a, b) => a - b).join(',')
        const stillChannelExist = channelExist.find(channel => {
            const channelPhoneNoStr = channel.contacts
                .map(contacts => contacts.phoneNo)
                .sort((a, b) => a - b)
                .join(',')
            // console.log(channelPhoneNoStr);

            return channelPhoneNoStr == membersIdsStr;
        })
        console.log(stillChannelExist, "existing stillChannelExist.....................................................................................");

        return stillChannelExist
    }

    async createMessage(message: string, channelId: string, senderId1: number, workspaceId :string | undefined ,unseen?: boolean, attachment?: string) {
        const sender = await this.contactsservice.findOneContact(senderId1, workspaceId);
        console.log(sender,"sendersendersendersendersendersendersendersender");
        
        if (!sender) throw new Error('Sender not found');
        const channel = await this.channelRepository.findOne({ where: { id: channelId, workspace : { id : workspaceId }}});
        if (!channel) throw new Error('Channel not found');

        const message_rec = this.messageRepository.create({
            message,
            attachment,
            sender: sender,
            channel: channel,
            unseen: unseen,
        })
        await this.messageRepository.save(message_rec)
        // console.log(message_rec);

        return message
    }

    async findAllChannel(workspaceId : string): Promise<Channel[]> {
        const allChannel = await this.channelRepository.find({
             relations: ['contacts'] ,
            })


            return await this.channelRepository
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.contacts', 'contacts')
            .leftJoinAndSelect('channel.messages', 'messages', 'messages.unseen = :unseen', { unseen: false })
            .leftJoinAndSelect('channel.workspace', 'workspace') // Ensure workspace relation is loaded
            .where('workspace.id = :workspaceId', { workspaceId }) // Filter by workspaceId
            .addSelect(
              (subQuery) =>
                subQuery
                  .select('MAX(m.createdAt)', 'latest_time')
                  .from(Message, 'm')
                  .where('m.channelId = channel.id'),
              'latest_message_time'
            )
            .orderBy('latest_message_time', 'DESC', 'NULLS LAST')
            .getMany();
        
        // return await this.channelRepository
        // .createQueryBuilder('channel')
        // .leftJoinAndSelect('channel.contacts', 'contacts')
        // .leftJoinAndSelect('channel.messages',
        //                    'messages',
        //                    "messages.unseen = :unseen", // Filter messages where unseen is false
        //                     { unseen: false }
        //                 )
        // .addSelect(
        //   (subQuery) =>
        //     subQuery
        //       .select('MAX(m.createdAt)', 'latest_time')
        //       .from(Message, 'm')
        //       .where('m.channelId = channel.id'),
        //   'latest_message_time'
        // )
        // .orderBy('latest_message_time', 'DESC', 'NULLS LAST')
        // .getMany();
    }

    // async findAllChannel(): Promise<Channel[]> {
    //     return await this.channelRepository
    //       .createQueryBuilder('channel')
    //       .leftJoinAndSelect('channel.contacts', 'contacts')
    //       .leftJoinAndSelect('channel.messages', 'messages') // Join messages
    //       .groupBy('channel.id') // Group by channel to avoid duplicates
    //       .orderBy('MAX(messages.createdAt)', 'DESC', 'NULLS LAST') // Sort by latest message
    //       .getMany();
    //   }

    //   async findMsgByChannelId(channelId: string): Promise<Message[]> {
    
    //     return await this.messageRepository
    //       .createQueryBuilder('message')
    //       .leftJoinAndSelect('message.channel', 'channel')
    //       .leftJoinAndSelect('message.sender', 'sender')
    //       .where('channel.id = :channelId', { channelId })
    //       .orderBy('message.createdAt', 'ASC')
    //       .getMany();
    //   }

    async findMsgByChannelId(channelId: any): Promise<Message[]> {

        var messages = await this.messageRepository.find({
            where: { channel: { id: channelId} },
            relations: ['channel', 'sender'],
            order: { createdAt: 'ASC' }
        })
        return messages;
    }

    async makeUnseenSeen(messages: Message[]): Promise<void> {
        const messageIds = messages.map(message => message.id); // Extract IDs
    
        // Update all matching messages in one query
        await this.messageRepository.update(
          { id: In(messageIds) }, // Where clause with IDs
          { unseen: true },       // Fields to update
        );
      }

      async findAllUnseen(): Promise<Message[]> {
        return await this.messageRepository.find({ 
            where: { unseen: false },
            relations : ['channel', 'sender'],
        })
      }

      async deleteChannelById(channelId : string) {
        const deleteChannel = await this.channelRepository.findOne({ where: { id: channelId}})
        if(deleteChannel)
            return this.channelRepository.remove(deleteChannel)
        else 
            null
      }


      async updateChannelNameById(channelId: string, updatedValue : string) {
        const channel = await this.channelRepository.findOne({ where : { id : channelId }})
        if (!channel) {
            throw new Error('Channel not found');
          }
        channel.channelName = updatedValue
        return await this.channelRepository.save(channel)
      }



    async handleFileUpload(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new Error('No file provided');
        }

        // Generate the URL
        const baseUrl = 'http://localhost:3000'; 
        const fileUrl = `${baseUrl}/${file.filename}`;

        // Here you could add additional logic, like saving file metadata to a database
        console.log(`File saved: ${file.path}, URL: ${fileUrl}`);
// // Convert to Base64 (for logging or other purposes)
// const fileBuffer = fs.readFileSync(file.path);
// const base64String = fileBuffer.toString('base64');
// console.log(base64String);

//              const response = await axios({
//             url: 'https://graph.facebook.com/v22.0/565830889949112/messages',
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${process.env.Whatsapp_Token}`,
//                 'Content-Type': 'application/json'
//             },
//             data: JSON.stringify({
//                 "messaging_product": "whatsapp",
//                 "to": "917202031718",
//                 "type": "image",
//                 "image": {
//                     "link" : base64String,
//                     "caption" : "this is image"
//                 }
//             })
//         })

        return fileUrl;
    }



    async deleteFile(filename: string): Promise<void> {
        // const filePath = join(this.uploadDir, filename);

        // if (!existsSync(filePath)) {
        //     throw new NotFoundException(`File ${filename} not found`);
        // }
        
        try {
            unlinkSync(`uploads\\${filename}`);
            console.log('File deleted: ${filePath}');
        } catch (error) {
            throw new Error("Failed to delete file: ${error.message}");
        }
    }


//     async submitTemplate(template: TemplateRequestInput): Promise<any> {
//       console.log(template,".templaet...................");
//       // const payload = {
//       //   name: 'exclusive_offer_3',
//       //   language: 'en_US' ,
//       //   category: 'MARKETING',
//       //   components: [
//       //     {
//       //       type: 'HEADER',
//       //       format: 'TEXT',
//       //       text: 'Special Offer!'
//       //     },
//       //     {
//       //       type: 'BODY',
//       //       text: 'Hi {{1}}, get 20% off on your next purchase. Offer valid till 8 pm. Shop now!'
//       //     },
//       //     {
//       //       type: 'FOOTER',
//       //       text: 'Powered by Chintan'
//       //     },
//       //     {
//       //       type: 'BUTTONS',
//       //       buttons: [
//       //         {
//       //           type: 'URL',
//       //           text: 'Shop Now',
//       //           url: 'https://yourstore.com/offer'
//       //         }
//       //       ]
//       //     }
//       //   ]
//       // };

//       const payload = {
//         name: 'promo_offer_202',
//         category: 'MARKETING',
//         language: 'en_US',
//         components: [
//           {
//             type: 'BODY',
//             text: 'Hi {{1}}, get 20% off your next purchase! Offer valid until 8 PM, May 31, 2025. Shop now!',
//             example: {
//               body_text: [["Sarah Smith"]]
//             }
//           },
//           {
//             type: 'BUTTONS',
//             buttons: [
//               {
//                 type: 'URL',
//                 text: 'Shop Now',
//                 url: 'https://your-ecommerce-site.com/promo' // Replace with a valid, approved URL
//               }
//             ]
//           }
//         ]
//       };
      
//       try {
//         const response = await axios({
//           url: `https://graph.facebook.com/v22.0/1649375815967023/message_templates`,
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer EAAao8Mkc6lMBO5QAttvc1GZAZBiqtOhIbt79YdM9C9mVPy4dZBoqxGss47tQS53WskKnGUA7qFKTZA5YK3kag7qn3CuaCf0D3n1QhV7m9GYq4v4CQGqiMv1dO8905iIXyUTyubfWGeprM1kdO4HUXhumU9ml8eoHFG8rHjiMZBqP2ta9ZBFmiqGLxR7emt02crNlXOTFlFBUaG8ksdXR9zD7TbFTlkZALPN1eO1`,
//             'Content-Type': 'application/json',
//           },
//           // data : JSON.stringify({...template})
//           data : JSON.stringify(payload)
//         });
//                   // data: JSON.stringify({
//           //   ...template,
//           //   allow_category_change: true,
//           // }),
  
//         console.log(response, "Fsdfsdfsdsdf....................................................");
//         const { id, status, category } = response.data;
//       if (!id) {
//         throw new Error('Template ID not returned in response');
//       }

//         return {
//           success: true,
//           data: response.data,
//         };
//       } catch (error) {
//         return {
//           success: false,
//           error: error.response?.data || error.message,
//         };
//       }
//     }
  
//     async getTemplateStatus(templateId: string): Promise<any> {
//       try {
//         const response = await axios({
//           // url: `https://graph.facebook.com/v22.0/1649375815967023/message_templates?template_id=${templateId}`,
//           url : `https://graph.facebook.com/v22.0/${templateId}?fields=name,status,category,language,components`,
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer EAAao8Mkc6lMBO5QAttvc1GZAZBiqtOhIbt79YdM9C9mVPy4dZBoqxGss47tQS53WskKnGUA7qFKTZA5YK3kag7qn3CuaCf0D3n1QhV7m9GYq4v4CQGqiMv1dO8905iIXyUTyubfWGeprM1kdO4HUXhumU9ml8eoHFG8rHjiMZBqP2ta9ZBFmiqGLxR7emt02crNlXOTFlFBUaG8ksdXR9zD7TbFTlkZALPN1eO1`,
//             'Content-Type': 'application/json',
//           },
//         });
//   console.log(response,"....................................................");
  
//         return {
//           success: true,
//           data: response.data,
//         };
//       } catch (error) {
//         return {
//           success: false,
//           error: error.response?.data || error.message,
//         };
//       }
//     }





// async getAllTemplates() {
//   const url = `https://graph.facebook.com/v22.0/1649375815967023/message_templates`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer EAAao8Mkc6lMBO5QAttvc1GZAZBiqtOhIbt79YdM9C9mVPy4dZBoqxGss47tQS53WskKnGUA7qFKTZA5YK3kag7qn3CuaCf0D3n1QhV7m9GYq4v4CQGqiMv1dO8905iIXyUTyubfWGeprM1kdO4HUXhumU9ml8eoHFG8rHjiMZBqP2ta9ZBFmiqGLxR7emt02crNlXOTFlFBUaG8ksdXR9zD7TbFTlkZALPN1eO1`,
//       },
//     });

//     const templates = response.data.data;
//     console.log(templates);
    
//     // console.log(`📋 Total Templates Found: ${templates.length}`);
//     // templates.forEach((t, i) => {
//     //   console.log(
//     //     `\n🔢 #${i + 1}\n🧾 Name: ${t.name}\n📦 Category: ${t.category}\n🌍 Language: ${t.language?.code}\n📄 Status: ${t.status}\n🆔 ID: ${t.id || 'Not returned'}`
//     //   );
//     // });
//     return "fsds"
//   } catch (err) {
//     console.error('❌ Error fetching templates:', err.response?.data || err.message);
//     return "fsds"
//   }

// }

}