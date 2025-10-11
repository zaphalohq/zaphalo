import { Logger, Scope } from '@nestjs/common';
import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { getWorkspaceConnection } from 'src/modules/workspace-manager/workspace.manager.utils';
import { WaMessageService } from 'src/customer-modules/whatsapp/services/whatsapp-message.service';
import { Broadcast } from 'src/customer-modules/broadcast/broadcast.entity';
import { messageTypes } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";

export type BroadcastJobData = { workspaceId: string, broadcastId: string};


@Processor({
  queueName: MessageQueue.broadcastMessageQueue,
  scope: Scope.REQUEST,
})
export class BroadcastMessageJob {
  protected readonly logger = new Logger(BroadcastMessageJob.name);

  constructor(
    private readonly waMessageService: WaMessageService,
  ) {}

  @Process(BroadcastMessageJob.name)
  async handleJob(data: any) {
    try{
      const workspaceCon = await getWorkspaceConnection(data.workspaceId);
      const broadcastRepo = workspaceCon.getRepository(Broadcast);
      const broadcast = await broadcastRepo.findOne({
        where: {id: data.broadcastId},
        relations: {
          whatsappAccount: true,
          template: true,
          contactList: {
            mailingContacts: true
          }
        }
      });

      if (broadcast){
        await this.sendWhatsappMessage(data.workspaceId, broadcast)
        this.logger.log(
          `Workspace ${data.workspaceId} braodcast ${data.broadcastId} sent to contacts`,
        );
      }
      this.logger.log(
        `Workspace ${data.workspaceId} braodcast ${data.broadcastId} not found`,
      );
    }catch(err){
      this.logger.warn(
        `Failed workspace ${data.workspaceId} braodcast ${data.broadcastId} sendindg to contacts. ${err}`,
      );
    }
  }

  async sendWhatsappMessage(workspaceId: string, broadcast: Broadcast){
    const contacts = broadcast?.contactList?.mailingContacts
    if (!contacts){
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
      }catch(err){
        this.logger.error(`Whatsapp message send issue. ${err}`)
      }
    }
  }
}

