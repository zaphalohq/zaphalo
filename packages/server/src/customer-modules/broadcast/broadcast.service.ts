import axios, { all } from 'axios';
import * as cron from 'node-cron';
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Connection, Repository, In, ILike } from 'typeorm';
import { Broadcast } from "./broadcast.entity";
import { BroadcastContacts } from "./broadcastContacts.entity";
import { MailingListService } from "src/customer-modules/mailingList/mailingList.service";
import { TemplateService } from "src/customer-modules/whatsapp/services/whatsapp-template.service";
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from '../whatsapp/services/whatsapp-api.service';
import { FindAllBrodcastRes } from './dto/FindAllBrodcastRes';

@Injectable()
export class BroadcastService implements OnModuleInit {
  private broadcastRepository: Repository<Broadcast>
  private broadcastContactsRepository: Repository<BroadcastContacts>
  onModuleInit() {

    // this.sendMessagesInBackground();
  }
  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly mailingListService: MailingListService,
    private readonly waTemplateService: TemplateService,
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,

  ) {
    this.broadcastRepository = connection.getRepository(Broadcast);
    this.broadcastContactsRepository = connection.getRepository(BroadcastContacts);

    this.onModuleInit()
  }

  private job: cron.ScheduledTask | null = null;

  // onModuleInit() {
  //   console.log("...................started.........................");

  //   this.cronForPendingBroadcasts();

  // }


  async saveBroadcast(broadcastData): Promise<Broadcast> {
    const mailingList = await this.mailingListService.findMailingListById(broadcastData.mailingListId)
    if (!mailingList) throw new Error('mailingList not found');
    const template = await this.waTemplateService.findtemplateByDbId(broadcastData.templateId)
    console.log(broadcastData.templateId, ".......................broadcastData.templateId");

    if (!template) throw new Error('template not found');

    const account = await this.waAccountService.findInstantsByInstantsId(broadcastData.accountId);
    if (!account) throw new Error('account not found');

    const broadcast = this.broadcastRepository.create({
      account: account,
      broadcastName: broadcastData.broadcastName,
      template: template,
      mailingList: mailingList,
    })
    await this.broadcastRepository.save(broadcast)

    const allContacts = await this.mailingListService.findAllContactsOfMailingList(broadcastData.mailingListId)

    allContacts.forEach(async (contact) => {
      const broadcastContacts = this.broadcastContactsRepository.create({
        contactNo: contact.contactNo,
        broadcast,
      })
      broadcast.totalBroadcast = String(allContacts.length)
      console.log(broadcast, '..broadcast');
      await this.broadcastRepository.save(broadcast)

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


  cronForPendingBroadcasts() {
    if (this.job) return;

    this.job = cron.schedule('*/30 * * * *', async () => {
      console.log('Running.........................');
      await this.sendMessagesInBackground();
    });
  }

  async sendMessagesInBackground() {
    console.log("...................started.........................");

    const broadcasts = await this.broadcastRepository.find({
      where: { isBroadcastDone: false },
      relations: ['template', 'account'],
    });


    if (broadcasts.length === 0) {

      console.log('All broadcasts completed. Stopping cron.');
      if (this.job) {
        this.job.stop();
        this.job = null;
      }
      return;
    }

    for (const broadcast of broadcasts) {
      const { template, account } = broadcast;
      const wa_api = await this.getWhatsAppApi(account?.id);

      const allBroadcastContacts = await this.broadcastContactsRepository.find({
        where: {
          broadcast: { id: broadcast.id },
          status: In(['PENDING', 'FAILED']),
        },
      });

      for (const broadcastContact of allBroadcastContacts) {
        let generateTemplatePayload;

        if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(template.headerType)) {
          const mediaLink = 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png';
          generateTemplatePayload = await this.waTemplateService.generateSendMessagePayload(template, broadcastContact.contactNo, mediaLink);
        } else {
          generateTemplatePayload = await this.waTemplateService.generateSendMessagePayload(template, broadcastContact.contactNo);
        }

        try {
          const sendTemplate = await wa_api.sendTemplateMsg(JSON.stringify(generateTemplatePayload));
          console.log(sendTemplate, 'resposer from api');

          if (sendTemplate?.messaging_product) {
            const currentBroadcastContact = await this.broadcastContactsRepository.findOne({ where: { id: broadcastContact.id } });
            if (currentBroadcastContact) {
              currentBroadcastContact.status = 'SENT';
              await this.broadcastContactsRepository.save(currentBroadcastContact);
            }
            console.log(broadcast.totalBroadcastSend, '........................broadcast.totalBroadcastSend');

            await this.broadcastRepository.update(broadcast.id, {
              totalBroadcastSend: String(Number(broadcast.totalBroadcastSend ?? 1) + 1),
            });
          }


        } catch (error) {
          const currentBroadcastContact = await this.broadcastContactsRepository.findOne({ where: { id: broadcastContact.id } });
          if (currentBroadcastContact) {
            currentBroadcastContact.status = 'FAILED';
            await this.broadcastContactsRepository.save(currentBroadcastContact);
          }

          console.error(`Failed to send to ${broadcastContact.contactNo}`, error.response?.data || error.message);
        }

        await new Promise((resolve) => setTimeout(resolve, 6000));
      }

      const hasPendingOrFailed = await this.broadcastContactsRepository.findOne({
        where: {
          broadcast: { id: broadcast.id },
          status: In(['PENDING', 'FAILED']),
        },
      });

      if (!hasPendingOrFailed) {
        await this.broadcastRepository.update(broadcast.id, {
          isBroadcastDone: true,
        });
      }
    }
  }

  async findAllBroadcast(currentPage, itemsPerPage): Promise<FindAllBrodcastRes> {
    const totalItems = await this.broadcastRepository.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage
    const allBroadcast =  await this.broadcastRepository.find({
      relations: {
        template: {
          attachment: true
        },
        mailingList: {
          mailingContacts: true
        },
        account: true
      },
      skip: startIndex,
      take: itemsPerPage,
      order: { createdAt: 'DESC' }
    });
    return { allBroadcast, totalPages}
  }
    // const remainingBroadcasts = await this.broadcastRepository.find({
    //   where: { isBroadcastDone: false },
    // });



  async searchBroadcast(
    searchTerm?: string,
  ) {
    const [broadcasts, totalCount] = await this.broadcastRepository.findAndCount({
      where: { broadcastName: ILike(`%${searchTerm}%`) },
      order: { createdAt: 'ASC' },
    });

    return { searchedData: broadcasts, totalCount };
  }

}