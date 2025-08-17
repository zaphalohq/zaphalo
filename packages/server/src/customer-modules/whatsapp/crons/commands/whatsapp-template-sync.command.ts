import { Command, CommandRunner } from 'nest-commander';

import {
  WHATSAPP_TMPL_SYNC_CRON_PATTERN,
  UpdateTemplateJob,
} from 'src/customer-modules/whatsapp/crons/jobs/whatsapp-template-sync.job';
import { InjectMessageQueue } from 'src/modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/modules/message-queue/services/message-queue.service';

@Command({
  name: 'cron:whatsapp:template-sync',
  description: 'Starts a cron job to sync whatsapp template',
})
export class WhatsAppTemplateSyncCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.waTmplSyncQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron<undefined>({
      jobName: UpdateTemplateJob.name,
      data: undefined,
      options: {
        repeat: { pattern: WHATSAPP_TMPL_SYNC_CRON_PATTERN },
      },
    });
  }
}
