import axios, { all } from 'axios';
import cron from 'node-cron';
import { Inject, Injectable } from "@nestjs/common";
import { Connection, Repository, In } from 'typeorm';
import { Broadcast } from "./broadcast.entity";
import { BroadcastContacts } from "./broadcastContacts.entity";
import { MailingListService } from "src/customer-modules/mailingList/mailingList.service";
import { TemplateService } from "src/customer-modules/whatsapp/services/whatsapp-template.service";
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from '../whatsapp/services/whatsapp-api.service';

@Injectable()
export class BroadcastService {
  private broadcastRepository: Repository<Broadcast>
  private broadcastContactsRepository: Repository<BroadcastContacts>
  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly mailingListService: MailingListService,
    private readonly waTemplateService: TemplateService,
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,

  ) {
    this.broadcastRepository = connection.getRepository(Broadcast);
    this.broadcastContactsRepository = connection.getRepository(BroadcastContacts);
  }

  onModuleInit() {
    this.sendMessagesInBackground();
  }

  async saveBroadcast(broadcastData): Promise<Broadcast> {
    const mailingList = await this.mailingListService.findMailingListById(broadcastData.mailingListId)
    if (!mailingList) throw new Error('mailingList not found');
    const template = await this.waTemplateService.findTemplateByTemplateId(broadcastData.templateId)
    console.log(broadcastData.templateId, ".......................broadcastData.templateId");

    if (!template) throw new Error('template not found');

    const account = await this.waAccountService.findInstantsByInstantsId(broadcastData.accountId);
    if (!account) throw new Error('account not found');

    const broadcast = this.broadcastRepository.create({
      account,
      broadcastName: broadcastData.broadcastName,
      template,
      mailingList,
    })
    await this.broadcastRepository.save(broadcast)

    const allContacts = await this.mailingListService.findAllContactsOfMailingList(broadcastData.mailingListId)
    allContacts.forEach(async (contact) => {
      const broadcastContacts = this.broadcastContactsRepository.create({
        contactNo: contact.contactNo,
        broadcast,
      })
      broadcast.totalBroadcast = String(allContacts.length)
      await this.broadcastContactsRepository.save(broadcastContacts)
    });

    return broadcast
  }

  async BroadcastTemplate(accessToken, broadcastData, phoneNumberId) {
    // const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
    const { templateName, variables = [], URL, headerType, language } = broadcastData;
    // const headerComponent =
    //   headerType === 'IMAGE' && URL
    //     ? [
    //       {
    //         type: 'header',
    //         parameters: [
    //           {
    //             type: 'image',
    //             image: {
    //               link: URL,
    //             },
    //           },
    //         ],
    //       },
    //     ]
    //     : headerType === 'VIDEO' && URL
    //       ? [
    //         {
    //           type: 'header',
    //           parameters: [
    //             {
    //               type: 'video',
    //               video: {
    //                 link: URL,
    //               },
    //             },
    //           ],
    //         },
    //       ]
    //       : headerType === 'DOCUMENT' && URL
    //         ? [
    //           {
    //             type: 'header',
    //             parameters: [
    //               {
    //                 type: 'document',
    //                 document: {
    //                   link: URL,
    //                 },
    //               },
    //             ],
    //           },
    //         ]
    //         : [];

    // const bodyComponent = {
    //   type: 'body',
    //   parameters: variables.map((value) => ({
    //     type: 'text',
    //     text: value,
    //   })),
    // };

    // const mailingList = await this.mailingListService.findMailingListById(broadcastData.mailingListId)
    // if (!mailingList) throw new Error('mailingList not found');
    // const template = await this.templateService.findTemplateByTemplateId(broadcastData.templateId)
    // console.log(broadcastData.templateId, ".......................broadcastData.templateId");

    // if (!template) throw new Error('template not found');

    // const account = await this.waAccountService.findInstantsByInstantsId(instantsId);

    // const broadcastName = 'default'
    // const broadcast = this.broadcastRepository.create({
    //   account
    //   broadcastName,
    //   template,
    //   mailingList,
    //   URL,
    //   variables,
    // })
    // await this.broadcastRepository.save(broadcast)

    // const allContacts = await this.mailingListService.findAllContactsOfMailingList(broadcastData.mailingListId)
    // allContacts.forEach(async (contact) => {
    //   const broadcastContacts = this.broadcastContactsRepository.create({
    //     contactNo: contact.contactNo,
    //     broadcast,
    //   })

    //   await this.broadcastContactsRepository.save(broadcastContacts)
    // });

    // this.cronForPendingBroadcasts()
    // return broadcast
  }

  async getWhatsAppApi(instantsId?: string) {
    if (instantsId) {
      const instants = await this.waAccountService.findInstantsByInstantsId(instantsId)
      if (!instants)
        throw new Error("Not found whatsappaccount")
      return this.whatsAppApiService.getWhatsApp(instants)
    } else {
      const findTrueInstants = await this.waAccountService.FindSelectedInstants()
      if (!findTrueInstants)
        throw new Error("Not found whatsappaccount")

      return this.whatsAppApiService.getWhatsApp(findTrueInstants)
    }
  }

  async cronForPendingBroadcasts() {
    cron.schedule('*/30 * * * *', async () => {
      await this.sendMessagesInBackground()
    })
  }

  private async sendMessagesInBackground() {

    const broadcasts = await this.broadcastRepository.find({
      where: {
        isBroadcastDone: false
      },
      relations: ['template', 'account']
    });


    broadcasts.forEach(async (broadcast) => {
      const { template } = broadcast;

      const wa_api = await this.getWhatsAppApi(broadcast?.account?.id)


      if (!broadcast) throw new Error('broadcast not found')
      const allBroadcastContacts = await this.broadcastContactsRepository.find({
        where: {
          broadcast: { id: broadcast.id },
          status: In(['PENDING', 'FAILED'])
        }
      })

      for (const broadcastContact of allBroadcastContacts) {
        let generateTemplatePayload
        if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(template.headerType)) {
          const mediaLink = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
          // const mediaLink = template.templateImg;
          generateTemplatePayload = await this.waTemplateService.generateSendMessagePayload(template, broadcastContact.contactNo, mediaLink);
        } else {
          generateTemplatePayload = await this.waTemplateService.generateSendMessagePayload(template, broadcastContact.contactNo);
        }

        try {
          const sendTemplate = await wa_api.sendTemplateMsg(JSON.stringify(generateTemplatePayload))
          const currentBroadcastContact = await this.broadcastContactsRepository.findOne({ where: { id: broadcastContact.id } })
          if (currentBroadcastContact) {
            currentBroadcastContact.status = 'SENT'
            await this.broadcastContactsRepository.save(currentBroadcastContact)
          }

          await this.broadcastRepository.update(broadcast.id, {
            totalBroadcastSend: String(Number(broadcast.totalBroadcastSend) + 1)
          });

        } catch (error) {
          const currentBroadcastContact = await this.broadcastContactsRepository.findOne({ where: { id: broadcastContact.id } })
          if (currentBroadcastContact) {
            currentBroadcastContact.status = 'FAILED'
            await this.broadcastContactsRepository.save(currentBroadcastContact)
          }
          console.error(`Failed to send to ${broadcastContact.contactNo}`, error.response?.data || error.message);
        }

        await new Promise((resolve) => setTimeout(resolve, 6000));
      }

      const hasPendingOrFailed = await this.broadcastContactsRepository.findOne({
        where: {
          broadcast: { id: broadcast.id },
          status: In(['PENDING', 'FAILED'])
        }
      });

      if (!hasPendingOrFailed) {
        await this.broadcastRepository.update(broadcast.id, {
          isBroadcastDone: true
        });
      }

    });







    // const headerType = template.headerType;
    // const headerType = 'TEXT';

    // const templateName = template.templateName;
    // const language = template.language;
    // const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    // const accessToken = findTrueInstants?.accessToken
    // const phoneNumberId = findTrueInstants?.phoneNumberId
    // const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

    // const { bodyComponent, headerComponent } = await this.templateMeta(headerType, variables)

    // if (!broadcast) throw new Error('broadcast not found')
    // const allBroadcastContacts = await this.broadcastContactsRepository.find({
    //   where: {
    //     broadcast: { id: broadcast.id },
    //     status: In(['PENDING', 'FAILED'])
    //   }
    // })

    // for (let i = 0; i < allBroadcastContacts.length; i++) {
    //   const broadcastContact = allBroadcastContacts[i];

    //   const payload = {
    //     messaging_product: 'whatsapp',
    //     to: broadcastContact.contactNo,
    //     type: 'template',
    //     template: {
    //       name: templateName,
    //       language: { code: language },
    //       components: [...headerComponent, bodyComponent],
    //     },
    //   };

    //   try {
    //     const response = await axios.post(url, payload, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     const currentBroadcastContact = await this.broadcastContactsRepository.findOne({ where: { id: broadcastContact.id } })
    //     if (currentBroadcastContact) {
    //       currentBroadcastContact.status = 'SENT'
    //       await this.broadcastContactsRepository.save(currentBroadcastContact)
    //     }

    //   } catch (error) {
    //     const currentBroadcastContact = await this.broadcastContactsRepository.findOne({ where: { id: broadcastContact.id } })
    //     if (currentBroadcastContact) {
    //       currentBroadcastContact.status = 'FAILED'
    //       await this.broadcastContactsRepository.save(currentBroadcastContact)
    //     }
    //     console.error(`Failed to send to ${broadcastContact.contactNo}`, error.response?.data || error.message);
    //   }

    //   await new Promise((resolve) => setTimeout(resolve, 6000));
    // }


  }

  // private async templateMeta(headerType: string, variables) {
  //   const headerComponent =
  //     headerType === 'IMAGE' && URL
  //       ? [
  //         {
  //           type: 'header',
  //           parameters: [
  //             {
  //               type: 'image',
  //               image: {
  //                 link: URL,
  //               },
  //             },
  //           ],
  //         },
  //       ]
  //       : headerType === 'VIDEO' && URL
  //         ? [
  //           {
  //             type: 'header',
  //             parameters: [
  //               {
  //                 type: 'video',
  //                 video: {
  //                   link: URL,
  //                 },
  //               },
  //             ],
  //           },
  //         ]
  //         : headerType === 'DOCUMENT' && URL
  //           ? [
  //             {
  //               type: 'header',
  //               parameters: [
  //                 {
  //                   type: 'document',
  //                   document: {
  //                     link: URL,
  //                   },
  //                 },
  //               ],
  //             },
  //           ]
  //           : [];

  //   const bodyComponent = {
  //     type: 'body',
  //     parameters: variables.map((value) => ({
  //       type: 'text',
  //       text: value,
  //     })),
  //   };

  //   return { bodyComponent, headerComponent }
  // }

  async findAllBroadcast(): Promise<Broadcast[]> {
    return await this.broadcastRepository.find({
      order: { createdAt: 'ASC' },
    });

  }

}