import { Logger, Scope } from '@nestjs/common';
import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { getWorkspaceConnection } from 'src/modules/workspace-manager/workspace.manager.utils';
import { WaMessageService } from 'src/customer-modules/whatsapp/services/whatsapp-message.service';
import { BroadcastService } from "src/customer-modules/broadcast/services/broadcast.service";
import { Broadcast } from 'src/customer-modules/broadcast/entities/broadcast.entity';
import { messageTypes } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";

export type BroadcastJobData = { workspaceId: string, broadcastId: string};


@Processor({
  queueName: MessageQueue.broadcastMessageQueue,
  scope: Scope.REQUEST,
})
export class BroadcastMessageJob {
  protected readonly logger = new Logger(BroadcastMessageJob.name);

  constructor(
    private readonly broadcastService: BroadcastService,
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
          template: {
            buttons:true,
            variables:true,
            attachment:true
          },
          contactList: {
            mailingContacts: true
          }
        }
      });

      if (broadcast){
        await this.broadcastService.sendWhatsappMessage(data.workspaceId, broadcast)
        this.logger.log(
          `Workspace ${data.workspaceId} braodcast ${data.broadcastId} sent to contacts`,
        );
        return
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
}

