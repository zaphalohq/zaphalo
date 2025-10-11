import { Logger, Scope } from '@nestjs/common';
import { DataSource, Repository, In } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { WaTemplateService } from 'src/customer-modules/whatsapp/services/whatsapp-template.service';
import { broadcastStates } from "src/customer-modules/broadcast/enums/broadcast.state.enum"
import { messageTypes } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";
import { Broadcast } from 'src/customer-modules/broadcast/broadcast.entity';
import { getWorkspaceConnection } from 'src/modules/workspace-manager/workspace.manager.utils';
import { WaMessageService } from 'src/customer-modules/whatsapp/services/whatsapp-message.service';
import { WhatsAppMessage } from 'src/customer-modules/whatsapp/entities/whatsapp-message.entity';
import { BroadcastCreatedEvent } from 'src/customer-modules/broadcast/events/broadcast-created.event';
import { Workspace } from "src/modules/workspace/workspace.entity";
import { EventEmitter2 } from '@nestjs/event-emitter';

export const BROADCAST_SEND_CRON_PATTERN = '*/1 * * * *';


@Processor({
  queueName: MessageQueue.broadcastSend,
  scope: Scope.REQUEST,
})
export class BroadcastSendJob {
  protected readonly logger = new Logger(BroadcastSendJob.name);

  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    private eventEmitter: EventEmitter2
  ) {}


  @Process(BroadcastSendJob.name)
  async handleJob(data: any) {
    console.log('📩 Processing Broadcast send job:', data);
    console.log("Starting...");
    const workspaces = await this.workspaceRepository.find({})
    for (const workspace of workspaces){
      this.sendBroadcast(workspace)
    }
  }


  async sendBroadcast(workspace: Workspace) {
    const workspaceCon = await getWorkspaceConnection(workspace.id);
    const broadcastRepo = workspaceCon.getRepository(Broadcast);
    const broadcasts = await broadcastRepo.find({
      where: {status: In([broadcastStates.scheduled, broadcastStates.in_progress])},
      relations: {
        whatsappAccount: true,
        template: true,
        contactList: {
          mailingContacts: true
        }
      }
    });

    for (const broadcast of broadcasts){
      const broadcastCreatedEvent = new BroadcastCreatedEvent();
      broadcastCreatedEvent.workspaceId = workspace.id
      broadcastCreatedEvent.broadcastId = broadcast.id

      this.eventEmitter.emit('broadcast.message.created', broadcastCreatedEvent)
      this.logger.log(
        `Workspace ${workspace.id} braodcast ${broadcast.id} sent to contacts`,
      );
    }
  }
}

