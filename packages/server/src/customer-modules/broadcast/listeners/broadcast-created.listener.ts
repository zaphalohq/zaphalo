import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BroadcastCreatedEvent } from '../events/broadcast-created.event';


import { InjectMessageQueue } from 'src/modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/modules/message-queue/services/message-queue.service';
import {
  BroadcastMessageJob,
  BroadcastJobData,
} from 'src/customer-modules/broadcast/jobs/broadcast-message.job';

@Injectable()
export class BroadcastCreatedListener {
  constructor(
    @InjectMessageQueue(MessageQueue.broadcastMessageQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnEvent('broadcast.message.created')
  async handleMessageCreatedEvent(event: BroadcastCreatedEvent) {
    // handle and process "handleMessageCreatedEvent" event
    await this.messageQueueService.add<BroadcastJobData>(
      BroadcastMessageJob.name,
      { workspaceId: event.workspaceId, broadcastId: event.broadcastId},
    );
  }
}