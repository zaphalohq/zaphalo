import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Connection, Repository, In, ILike } from 'typeorm';
import axios, { all } from 'axios';
import { Broadcast } from "src/customer-modules/broadcast/entities/broadcast.entity";
import { BroadcastTrace } from "src/customer-modules/broadcast/entities/broadcast-trace.entity";
import { MailingListService } from "src/customer-modules/mailingList/mailingList.service";
import { WaTemplateService } from "src/customer-modules/whatsapp/services/whatsapp-template.service";
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { WaMessageService } from "src/customer-modules/whatsapp/services/whatsapp-message.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from 'src/customer-modules/whatsapp/services/whatsapp-api.service';
import { broadcastStates } from "src/customer-modules/broadcast/enums/broadcast.state.enum"
import { BroadcastCreatedEvent } from 'src/customer-modules/broadcast/events/broadcast-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { messageTypes } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";

import {
  BroadcastException,
  BroadcastExceptionCode,
} from 'src/customer-modules/broadcast/broadcast.exception';

const relations = {
  template: {
    attachment: true
  },
  contactList: {
    mailingContacts: true
  },
  whatsappAccount: true
}

@Injectable()
export class BroadcastService {
  private broadcastRepository: Repository<Broadcast>
  private broadcastTraceRepository: Repository<BroadcastTrace>
  protected readonly logger = new Logger(BroadcastService.name);

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly mailingListService: MailingListService,
    private readonly waTemplateService: WaTemplateService,
    private readonly waAccountService: WaAccountService,
    private readonly waMessageService: WaMessageService,
    private readonly whatsAppApiService: WhatsAppSDKService,
    private eventEmitter: EventEmitter2
  ) {
    this.broadcastRepository = connection.getRepository(Broadcast);
    this.broadcastTraceRepository = connection.getRepository(BroadcastTrace);
  }

  async createBroadcast(workspaceId, broadcastData) {
    if (broadcastData.broadcastId) throw new Error('Broadcast already created');
    const mailingList = await this.mailingListService.findMailingListById(broadcastData.mailingListId)
    if (!mailingList) throw new Error('mailingList not found');
    const templateRes = await this.waTemplateService.getTemplate(broadcastData.templateId)
    const template = templateRes?.template
    if (!template) throw new Error('template not found');

    const account = await this.waAccountService.findInstantsByInstantsId(broadcastData.whatsappAccountId);
    if (!account){
      throw new BroadcastException(
        'Whatsapp account not found',
        BroadcastExceptionCode.INVALID_WHATSAPP_ACCOUNT,
      );
    }

    const broadcast = this.broadcastRepository.create({
      whatsappAccount: account,
      name: broadcastData.broadcastName,
      template: template,
      contactList: mailingList,
      scheduledAt: broadcastData.scheduledAt ? broadcastData.scheduledAt : null,
    })
    await this.broadcastRepository.save(broadcast)

    const broadcastFind = await this.getBroadcast(broadcast.id)

    if (!broadcastFind.broadcast) throw new Error('Broadcast not found');
    return {'broadcast': broadcastFind.broadcast, 'message': 'Broadcast created', 'status': true}
  }

  async saveBroadcast(workspaceId, broadcastData) {
    if (!broadcastData.broadcastId) throw new Error('Broadcast ID invalid!');

    const contactList = await this.mailingListService.findMailingListById(broadcastData.contactListId)
    if (!contactList) throw new Error('mailingList not found');
    const templateRes = await this.waTemplateService.getTemplate(broadcastData.templateId)
    const template = templateRes?.template
    if (!template) throw new Error('template not found');

    const waAccountRes = await this.waAccountService.getWaAccount(broadcastData.whatsappAccountId);
    if (!waAccountRes.waAccount) throw new Error('Whatsapp account not found');

    const broadcastFind = await this.getBroadcast(broadcastData.broadcastId)

    if (!broadcastFind.broadcast) throw new Error('Broadcast ID invalid!');

    Object.assign(broadcastFind.broadcast, {
      whatsappAccount: waAccountRes.waAccount,
      name: broadcastData.broadcastName,
      template: template,
      contactList: contactList,
      scheduledAt: broadcastData.scheduledAt ? broadcastData.scheduledAt : null,
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
      relations
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

  async getContactList(contactListId: string) {
    const contactList = await this.mailingListService.findMailingListById(contactListId)
    if (!contactList) {
      return {
        contactList: null,
        message: 'Contact list not found',
        status: false
      };
    }

    return {
      contactList: contactList,
      message: 'Contact list found',
      status: true
    };
  }

  async deleteBroadcast(broadcastIds: string[]){
    const broadcasts = await await this.broadcastRepository.find({
      where: {
        id: In(broadcastIds)
      }
    })
    for (const broadcast of broadcasts){
      if(broadcast.status != broadcastStates.new){
        throw new BroadcastException(
          `${broadcast.status} broadcast can not be delete.`,
          BroadcastExceptionCode.INVALID_STATUS,
        );
      }
    }

    await this.broadcastRepository.delete(broadcastIds);

    return {
      'message': 'Broadcast deleted',
      'status': true
    }
  }

  async cancelBroadcast(broadcastId: string){
    const broadcastFind = await this.getBroadcast(broadcastId)
    const broadcast = broadcastFind.broadcast

    if (!broadcast) {
      throw new Error('Broadcast not found');
    }

    if (![broadcastStates.new, broadcastStates.scheduled, broadcastStates.in_progress].includes(broadcast.status)) {
      throw new BroadcastException(
        `${broadcast.status} broadcast can not be cancelled.`,
        BroadcastExceptionCode.INVALID_STATUS,
      );
    }
    Object.assign(broadcast, {
      status: broadcastStates.cancel
    })
    await this.broadcastRepository.save(broadcast);
    return {
      'broadcast': broadcast,
      'message': 'Broadcast cancelled',
      'status': true
    }
  }

  async sendBroadcast(broadcastId: string){
    const broadcastFind = await this.getBroadcast(broadcastId)
    const broadcast = broadcastFind.broadcast

    if (!broadcast) {
      throw new Error('Broadcast not found');
    }

    if (![broadcastStates.new].includes(broadcast.status)) {
      throw new BroadcastException(
        `${broadcast.status} broadcast can not be send.`,
        BroadcastExceptionCode.INVALID_STATUS,
      );
    }
    Object.assign(broadcast, {
      status: broadcastStates.in_progress
    })
    await this.broadcastRepository.save(broadcast);
    return {
      'broadcast': broadcast,
      'message': 'Broadcast sent for send',
      'status': true
    }
  }

  async scheduleBroadcast(broadcastId: string){
    const broadcastFind = await this.getBroadcast(broadcastId)
    const broadcast = broadcastFind.broadcast

    if (!broadcast) {
      throw new Error('Broadcast not found');
    }

    if (![broadcastStates.new, broadcastStates.in_progress].includes(broadcast.status)) {
      throw new BroadcastException(
        `${broadcast.status} broadcast can not be scheduled.`,
        BroadcastExceptionCode.INVALID_STATUS,
      );
    }
    Object.assign(broadcast, {
      status: broadcastStates.scheduled
    })
    await this.broadcastRepository.save(broadcast);
    return {
      'broadcast': broadcast,
      'message': 'Broadcast scheduled',
      'status': true
    }
  }


  async getBroadcastBytemplate(templateId: string) {
    const broadcast =await this.broadcastRepository.find(
      {
        where: {
          template: { id: templateId }
        }
      }
    )
    if(!broadcast){
      throw new Error("Broadcasts of this template not found")
    }
    return broadcast
  }

  async getRemainingContacts(broadcast: Broadcast){
    const contacts = broadcast?.contactList?.mailingContacts
    const traces = await this.broadcastTraceRepository
      .createQueryBuilder()
      .where({ broadcast: {id: broadcast.id}})
      .select(['mobile'])
      .getRawMany();

    const alreadySentContacts = traces.map(trace => trace.mobile);
    const filtered = contacts.filter((contact) => !alreadySentContacts.includes(contact.contactNo));
    return filtered
  }

  async sendWhatsappMessage(workspaceId: string, broadcast: Broadcast){
    Object.assign(broadcast, {status: broadcastStates['in_progress']})
    await this.broadcastRepository.save(broadcast)
    const contacts = await this.getRemainingContacts(broadcast)
    if (!contacts.length){
      Object.assign(broadcast, {status: broadcastStates['done']})
      await this.broadcastRepository.save(broadcast)
      return
    }
    for (const receiver of contacts) {
      const msgVal = {
        mobileNumber: receiver.contactNo,
        messageType: messageTypes.OUTBOUND,
        waAccountId: broadcast.whatsappAccount,
        waTemplateId: broadcast.template,
      }
      try{
        const waMessage = await this.waMessageService.createWaMessage(workspaceId, msgVal, true)
        const trace = this.broadcastTraceRepository.create({
          broadcast: broadcast,
          whatsAppMesssage: waMessage,
          mobile: receiver.contactNo,
        })
        this.broadcastTraceRepository.save(trace)
      }catch(err){
        this.logger.error(`Whatsapp message send issue. ${err}`)
      }
    }
  }
}