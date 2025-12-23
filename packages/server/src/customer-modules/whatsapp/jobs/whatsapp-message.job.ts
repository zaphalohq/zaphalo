import { Logger, Scope } from '@nestjs/common';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';

import { getWorkspaceConnection } from 'src/modules/workspace-manager/workspace.manager.utils';
import { WaMessageService } from 'src/customer-modules/whatsapp/services/whatsapp-message.service';
import { WhatsAppMessage } from '../entities/whatsapp-message.entity';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';


export type WhatsAppMessageJobData = { workspaceId: string, messageId: string};

@Processor({
  queueName: MessageQueue.sendWaQueue,
  scope: Scope.REQUEST,
})
export class SendWhatsAppMessageJob {
  protected readonly logger = new Logger(SendWhatsAppMessageJob.name);

  constructor(
    private readonly waMessageService: WaMessageService,
  ) {}

  @Process(SendWhatsAppMessageJob.name)
  async handleJob(data: WhatsAppMessageJobData): Promise<void>{
    try{
      const workspaceCon = await getWorkspaceConnection(data.workspaceId);
      const waMessageRepo = workspaceCon.getRepository(WhatsAppMessage);
      const waMessage = await waMessageRepo.findOne({
        where: {id: data.messageId},
      });

      await this.waMessageService.sendWhatsappMessage(data.messageId, data.workspaceId)

      this.logger.log(
        `Workspace ${data.workspaceId} whatsapp message ${data.messageId} sent to contacts`,
      );
    }catch(err){
      this.logger.warn(
        `Failed workspace ${data.workspaceId} whatsapp message ${data.messageId} sendindg to contacts. ${err}`,
      );
    }
  }
}

