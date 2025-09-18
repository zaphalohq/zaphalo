import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Connection, Repository, In, ILike } from 'typeorm';
import axios, { all } from 'axios';
import { Broadcast } from "./broadcast.entity";
import { BroadcastContacts } from "./broadcastContacts.entity";
import { MailingListService } from "src/customer-modules/mailingList/mailingList.service";
import { WaTemplateService } from "src/customer-modules/whatsapp/services/whatsapp-template.service";
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from '../whatsapp/services/whatsapp-api.service';
import { broadcastStates } from "src/customer-modules/broadcast/enums/broadcast.state.enum"
import { BroadcastCreatedEvent } from 'src/customer-modules/broadcast/events/broadcast-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BroadcastService {
  private broadcastRepository: Repository<Broadcast>
  private broadcastContactsRepository: Repository<BroadcastContacts>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly mailingListService: MailingListService,
    private readonly waTemplateService: WaTemplateService,
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,
    private eventEmitter: EventEmitter2
  ) {
    this.broadcastRepository = connection.getRepository(Broadcast);
    this.broadcastContactsRepository = connection.getRepository(BroadcastContacts);
  }

  async createBroadcast(workspaceId, broadcastData) {
    if (broadcastData.broadcastId) throw new Error('Broadcast already created');
    const mailingList = await this.mailingListService.findMailingListById(broadcastData.mailingListId)
    if (!mailingList) throw new Error('mailingList not found');
    const template = await this.waTemplateService.findtemplateByDbId(broadcastData.templateId)

    if (!template) throw new Error('template not found');

    const account = await this.waAccountService.findInstantsByInstantsId(broadcastData.accountId);
    if (!account) throw new Error('account not found');

    const broadcast = this.broadcastRepository.create({
      whatsappAccount: account,
      name: broadcastData.broadcastName,
      template: template,
      contactList: mailingList,
      status: broadcastData.status
    })
    await this.broadcastRepository.save(broadcast)

    const broadcastCreatedEvent = new BroadcastCreatedEvent();

    broadcastCreatedEvent.workspaceId = workspaceId
    broadcastCreatedEvent.broadcastId = broadcast.id

    this.eventEmitter.emit('broadcast.message.created', broadcastCreatedEvent)

    const broadcastFind = await this.getBroadcast(broadcast.id)

    if (!broadcastFind.broadcast) throw new Error('Broadcast not found');
    return {'broadcast': broadcastFind.broadcast, 'message': 'Broadcast created', 'status': true}
  }

  async saveBroadcast(workspaceId, broadcastData) {
    if (!broadcastData.broadcastId) throw new Error('Broadcast ID invalid!');


    const mailingList = await this.mailingListService.findMailingListById(broadcastData.mailingListId)
    if (!mailingList) throw new Error('mailingList not found');
    const template = await this.waTemplateService.findtemplateByDbId(broadcastData.templateId)

    if (!template) throw new Error('template not found');

    const account = await this.waAccountService.findInstantsByInstantsId(broadcastData.accountId);
    if (!account) throw new Error('account not found');

    const broadcastFind = await this.getBroadcast(broadcastData.broadcastId)

    if (!broadcastFind.broadcast) throw new Error('Broadcast ID invalid!');

    Object.assign(broadcastFind.broadcast, {
      whatsappAccount: account,
      name: broadcastData.broadcastName,
      template: template,
      contactList: mailingList,
      status: broadcastData.status
    })

    await this.broadcastRepository.save(broadcastFind.broadcast)
    if (!broadcastFind) throw new Error('Broadcast ID invalid!');
    
    return {'broadcast': broadcastFind.broadcast, 'message': 'Broadcast saved', 'status': true}
  }

  async searchBroadcast(
    searchTerm?: string,
  ) {
    const [broadcasts, totalCount] = await this.broadcastRepository.findAndCount({
      where: { name: ILike(`%${searchTerm}%`) },
      order: { createdAt: 'ASC' },
    });

    return { searchedData: broadcasts, totalCount };
  }

  async readBroadcast(
    search?: string,
    limit?: number,
  ) {
    const broadcasts = await this.broadcastRepository.find({
      where: { name: ILike(`%${search}%`) },
      order: { createdAt: 'ASC' },
      take: limit,
    });
    return broadcasts;
  }

  async getBroadcast(
    broadcastId: string,
  ) {
    const broadcastFind = await this.broadcastRepository.findOne({
      where: { id: broadcastId },
      relations: {
        template: {
          attachment: true
        },
        contactList: {
          mailingContacts: true
        },
        whatsappAccount: true
      }
    });
    if (!broadcastFind){
      throw new Error('Broadcast not found');
    }
    return {'broadcast': broadcastFind, 'message': 'Broadcast found', 'status': true}
  }

  async searchReadBroadcast(
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
    filter: string = '',
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    // Search (by name)
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    // Filter (by status)
    if (filter && filter !== 'All') {
      where.status = filter;
    }

    const [broadcasts, total] = await this.broadcastRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
      relations: {
        template: {
          attachment: true
        },
        contactList: {
          mailingContacts: true
        },
        whatsappAccount: true
      },
    });

    return {
      broadcasts,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }
}