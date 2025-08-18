import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { Logger, Scope } from '@nestjs/common';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getWorkspaceConnection } from 'src/modules/workspace-manager/workspace.manager.utils';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';
import { WhatsAppSDKService } from 'src/customer-modules/whatsapp/services/whatsapp-api.service';

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
  ) {}

  @Process(SendWhatsAppMessageJob.name)
  async handleJob(data: any) {

    const workspaceId = '2d72db64-01fc-4e64-b1ed-df79355857f9'
    const workspaceCon = await getWorkspaceConnection(workspaceId);
    const whatsAppTemplateRepo = workspaceCon.getRepository(WhatsAppAccount);
    console.log('........................workspaceCon..............', whatsAppTemplateRepo);
    const allTmpl = await whatsAppTemplateRepo.find({
      order: { createdAt: 'ASC' }
    });
    const waApi = this.whatsAppApiService.getWhatsApp(allTmpl[0])
    console.log("................allTmpl..............", allTmpl, waApi);
    waApi._test_connection();

    console.log('📩 Processing WhatsApp job:', data);
    console.log("Starting...");
    await sleep(3000); // Pause execution for 3 seconds
    console.log("...Continuing after delay.");
    
    // send WhatsApp logic
  }
}

