import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsAppMessageCreatedEvent } from '../events/whatsapp-message-created.event';


import { InjectMessageQueue } from 'src/modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/modules/message-queue/services/message-queue.service';
import {
  SendWhatsAppMessageJob,
  WhatsAppMessageJobData,
} from 'src/customer-modules/whatsapp/jobs/whatsapp-message.job';

@Injectable()
export class WhatsAppMessageCreatedListener {
  constructor(
    @InjectMessageQueue(MessageQueue.sendWaQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnEvent('whatsapp.message.created')
  async handleOrderCreatedEvent(event: WhatsAppMessageCreatedEvent) {
    // handle and process "OrderCreatedEvent" event

    console.log(".....................SendWhatsAppMessageJob.name............", SendWhatsAppMessageJob.name);

    await this.messageQueueService.add<WhatsAppMessageJobData>(
      SendWhatsAppMessageJob.name,
      { workspaceId: event.workspaceId, messageId: event.messageId},
    );
    console.log("..................event......", event);
  }
}