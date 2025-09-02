import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { Logger, Scope } from '@nestjs/common';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getWorkspaceConnection } from 'src/modules/workspace-manager/workspace.manager.utils';
import { WhatsAppSDKService } from 'src/customer-modules/whatsapp/services/whatsapp-api.service';
import { WaMessageService } from 'src/customer-modules/whatsapp/services/whatsapp-message.service';

import { WhatsAppMessage } from '../entities/whatsapp-message.entity';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';


export type WhatsAppMessageJobData = { workspaceId: string, messageId: string};



async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Processor({
  queueName: MessageQueue.sendWaQueue,
  scope: Scope.REQUEST,
})
export class SendWhatsAppMessageJob {
  constructor(
    private readonly whatsAppApiService: WhatsAppSDKService,
    private readonly whatsAppSDKService: WhatsAppSDKService,
    private readonly waMessageService: WaMessageService,
  ) {}

  @Process(SendWhatsAppMessageJob.name)
  async handleJob(data: any) {

    const workspaceCon = await getWorkspaceConnection(data.workspaceId);
    const waMessageRepo = workspaceCon.getRepository(WhatsAppMessage);
    const waMessage = await waMessageRepo.findOne({
      where: {id: data.messageId},
    });
    // this.waMessageService.sendWhatsappMessage(data)

    console.log('📩 Processing WhatsApp job:', data);
    console.log("Starting...");
    await sleep(3000); // Pause execution for 3 seconds
    console.log("...Continuing after delay.");
    
    // send WhatsApp logic
  }
}

