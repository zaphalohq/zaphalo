import { SetMetadata } from '@nestjs/common';

import { PROCESS_METADATA } from 'src/modules/message-queue/message-queue.constants';

export interface MessageQueueProcessOptions {
  jobName: string;
}

export function Process(jobName: string): MethodDecorator {
  return SetMetadata(PROCESS_METADATA, { jobName });
}
