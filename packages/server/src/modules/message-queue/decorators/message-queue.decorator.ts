import { Inject } from '@nestjs/common';

import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';
import { getQueueToken } from 'src/modules/message-queue/utils/get-queue-token.util';

export const InjectMessageQueue = (queueName: MessageQueue) => {
  return Inject(getQueueToken(queueName));
};
