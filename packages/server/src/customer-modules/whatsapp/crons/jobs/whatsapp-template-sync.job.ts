import { Processor } from 'src/modules/message-queue/decorators/processor.decorator';
import { Process } from 'src/modules/message-queue/decorators/process.decorator';
import { Logger, Scope } from '@nestjs/common';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';

export const WHATSAPP_TMPL_SYNC_CRON_PATTERN = '*/1 * * * *';


@Processor({
  queueName: MessageQueue.waTmplSyncQueue,
  scope: Scope.REQUEST,
})
export class UpdateTemplateJob {
  @Process(UpdateTemplateJob.name)
  async handleJob(data: any) {
    console.log('📩 Processing WhatsApp Template Sync job:', data);
    console.log("Starting...");
    console.log("...Continuing after delay.");
    
    // send WhatsApp logic
  }
}

