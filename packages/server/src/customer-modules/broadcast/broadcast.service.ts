import axios from 'axios';
import cron from 'node-cron';
import { Inject, Injectable } from "@nestjs/common";
import { Connection, Repository, In } from 'typeorm';
import { Broadcast } from "./broadcast.entity";
import { BroadcastContacts } from "./broadcastContacts.entity";
import { MailingListService } from "src/customer-modules/mailingList/mailingList.service";
import { TemplateService } from "src/customer-modules/whatsapp/services/whatsapp-template.service";
import { instantsService } from "src/customer-modules/instants/instants.service";
import { WorkspaceService } from "src/modules/workspace/workspace.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';

@Injectable()
export class BroadcastService {
  private broadcastRepository: Repository<Broadcast>
  private broadcastContactsRepository: Repository<BroadcastContacts>
  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly mailingListService: MailingListService,
    private readonly templateService: TemplateService,
    private readonly workspaceService: WorkspaceService,
    private readonly instantsService: instantsService
  ) {
    this.broadcastRepository = connection.getRepository(Broadcast);
    this.broadcastContactsRepository = connection.getRepository(BroadcastContacts);
  }

  onModuleInit() {
    this.sendMessagesInBackground();
  }

  async BroadcastTemplate(accessToken, broadcastData, phoneNumberId): Promise<Broadcast> {
    const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;
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

    const mailingList = await this.mailingListService.findMailingListById(broadcastData.mailingListId)
    if (!mailingList) throw new Error('mailingList not found');
    const template = await this.templateService.findTemplateByTemplateId(broadcastData.templateId)
    console.log(broadcastData.templateId,".......................broadcastData.templateId");
    
    if (!template) throw new Error('template not found');

    const broadcastName = 'default'
    const broadcast = this.broadcastRepository.create({
      broadcastName,
      template,
      mailingList,
      URL,
      variables,
    })
    await this.broadcastRepository.save(broadcast)

    const allContacts = await this.mailingListService.findAllContactsOfMailingList(broadcastData.mailingListId)
    allContacts.forEach(async (contact) => {
      const broadcastContacts = this.broadcastContactsRepository.create({
        contactNo: contact.contactNo,
        broadcast,
      })

      await this.broadcastContactsRepository.save(broadcastContacts)
    });

    this.cronForPendingBroadcasts()
    return broadcast
  }

  private async cronForPendingBroadcasts() {
    cron.schedule('*/30 * * * *', async () => {
      await this.sendMessagesInBackground()
    })
  }

  private async sendMessagesInBackground() {
    const broadcasts = await this.broadcastRepository.find({
      where: {
        isBroadcastDone: false
      },
      relations: ['template', 'workspace']
    });

    broadcasts.forEach(async (broadcast) => {
      const { template, variables, URL } = broadcast;
      // const headerType = template.headerType;
      const headerType = 'TEXT';

      const templateName = template.templateName;
      const language = template.language;
      const findTrueInstants = await this.instantsService.FindSelectedInstants()
      const accessToken = findTrueInstants?.accessToken
      const phoneNumberId = findTrueInstants?.phoneNumberId
      const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

      const { bodyComponent, headerComponent } = await this.templateMeta(headerType, variables)

      if (!broadcast) throw new Error('broadcast not found')
      const allBroadcastContacts = await this.broadcastContactsRepository.find({
        where: {
          broadcast: { id: broadcast.id },
          status: In(['PENDING', 'FAILED'])
        }
      })

      for (let i = 0; i < allBroadcastContacts.length; i++) {
        const broadcastContact = allBroadcastContacts[i];

        const payload = {
          messaging_product: 'whatsapp',
          to: broadcastContact.contactNo,
          type: 'template',
          template: {
            name: templateName,
            language: { code: language },
            components: [...headerComponent, bodyComponent],
          },
        };

        try {
          const response = await axios.post(url, payload, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          const currentBroadcastContact = await this.broadcastContactsRepository.findOne({ where: { id: broadcastContact.id } })
          if (currentBroadcastContact) {
            currentBroadcastContact.status = 'SENT'
            await this.broadcastContactsRepository.save(currentBroadcastContact)
          }

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
      const isBroadcastSucceed = await this.broadcastContactsRepository.findOne({
        where: {
          broadcast: { id: broadcast.id },
          status: In(['PENDING', 'FAILED'])
        }
      })
      if (!isBroadcastSucceed?.id) {
        const updateBroadcast = await this.broadcastRepository.findOne({ where: { id: broadcast.id } });
        if (updateBroadcast) {
          updateBroadcast.isBroadcastDone = true;
          await this.broadcastRepository.save(updateBroadcast);
        }
      }
    });

  }

  private async templateMeta(headerType: string, variables) {
    const headerComponent =
      headerType === 'IMAGE' && URL
        ? [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: URL,
                },
              },
            ],
          },
        ]
        : headerType === 'VIDEO' && URL
          ? [
            {
              type: 'header',
              parameters: [
                {
                  type: 'video',
                  video: {
                    link: URL,
                  },
                },
              ],
            },
          ]
          : headerType === 'DOCUMENT' && URL
            ? [
              {
                type: 'header',
                parameters: [
                  {
                    type: 'document',
                    document: {
                      link: URL,
                    },
                  },
                ],
              },
            ]
            : [];

    const bodyComponent = {
      type: 'body',
      parameters: variables.map((value) => ({
        type: 'text',
        text: value,
      })),
    };

    return { bodyComponent, headerComponent }
  }

  async findAllBroadcast(workspaceId: string): Promise<Broadcast[]> {
    return await this.broadcastRepository.find({
      order: { createdAt: 'ASC' },
    });

  }

}