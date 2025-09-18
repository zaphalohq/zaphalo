import { Scope } from '@nestjs/common';
import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { getWorkspaceConnection } from 'src/modules/workspace-manager/workspace.manager.utils';
import { WaMessageService } from 'src/customer-modules/whatsapp/services/whatsapp-message.service';

export type BroadcastJobData = { workspaceId: string, broadcastId: string};


@Processor({
  queueName: MessageQueue.broadcastMessageQueue,
  scope: Scope.REQUEST,
})
export class BroadcastMessageJob {
  constructor(
    private readonly waMessageService: WaMessageService,
  ) {}

  @Process(BroadcastMessageJob.name)
  async handleJob(data: any) {
    // const workspaceCon = await getWorkspaceConnection(data.workspaceId);
    // const waMessageRepo = workspaceCon.getRepository(WhatsAppMessage);
    // const waMessage = await waMessageRepo.findOne({
    //   where: {id: data.messageId},
    // });
    // this.waMessageService.sendWhatsappMessage(data)

    console.log('📩 Processing Broadcast job:', data);
    console.log("Starting...");
    console.log("...Continuing after delay.");
  }
}

