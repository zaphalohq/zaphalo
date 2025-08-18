import { Inject, Injectable } from "@nestjs/common";
import { Connection, ILike, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';

import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppMessage } from "../entities/whatsapp-message.entity";
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService } from "./whatsapp-account.service";
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { InjectMessageQueue } from 'src/modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';

import {
  SendWhatsAppMessageJob,
  // WhatsAppMessageJobData,
} from 'src/customer-modules/whatsapp/jobs/whatsapp-message.job';
import PgBoss from 'pg-boss';
import { PgBossDriver } from 'src/modules/message-queue/drivers/pgboss.driver';
import { MessageQueueService } from 'src/modules/message-queue/services/message-queue.service';

export type WhatsAppMessageJobData = { to: string, text: string };

@Injectable()
export class MessageService {

  constructor(
    @InjectMessageQueue(MessageQueue.sendWaQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
  }

  async queueMessage(to: string, text: string) {


    await this.messageQueueService.add<WhatsAppMessageJobData>(
      SendWhatsAppMessageJob.name,
      { to: '000', text: 'Hello' },
    );
  }
  
}