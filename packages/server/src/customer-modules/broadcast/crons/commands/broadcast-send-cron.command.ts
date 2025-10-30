import { Command, CommandRunner } from 'nest-commander';

import {
  BROADCAST_SEND_CRON_PATTERN,
  BroadcastSendJob,
} from 'src/customer-modules/broadcast/crons/jobs/broadcast-send-cron.job';
import { InjectMessageQueue } from 'src/modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/modules/message-queue/services/message-queue.service';

@Command({
  name: 'cron:broadcast:send',
  description: 'Starts a cron job to send broadcast',
})
export class BroadcastSendCronCommand extends CommandRunner {
  constructor(
    @InjectMessageQueue(MessageQueue.broadcastSend)
    private readonly messageQueueService: MessageQueueService,
  ) {
    super();
  }

  async run(): Promise<void> {
    await this.messageQueueService.addCron<undefined>({
      jobName: BroadcastSendJob.name,
      data: undefined,
      options: {
        repeat: { pattern: BROADCAST_SEND_CRON_PATTERN },
      },
    });
  }
}
