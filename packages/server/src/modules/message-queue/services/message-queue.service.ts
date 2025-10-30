import { Inject, Injectable } from '@nestjs/common';

import { MessageQueueDriver } from 'src/modules/message-queue/drivers/interfaces/message-queue-driver.interface';
import {
  MessageQueueJobData,
  MessageQueueJob,
} from 'src/modules/message-queue/interfaces/message-queue-job.interface';

import {
  QueueCronJobOptions,
  QueueJobOptions,
} from 'src/modules/message-queue/drivers/interfaces/job-options.interface';

import {
  MessageQueue,
  QUEUE_DRIVER,
} from 'src/modules/message-queue/message-queue.constants';
import { MessageQueueWorkerOptions } from 'src/modules/message-queue/interfaces/message-queue-worker-options.interface';


@Injectable()
export class MessageQueueService {
  constructor(
    @Inject(QUEUE_DRIVER) protected driver: MessageQueueDriver,
    protected queueName: MessageQueue,
  ) {
    if (typeof this.driver.register !== undefined) {
      this.driver.register(queueName);
    }
  }
  add<T extends MessageQueueJobData>(
    jobName: string,
    data: T,
    options?: QueueJobOptions,
  ): Promise<void> {
        console.log('✅ Job queued');
    return this.driver.add(this.queueName, jobName, data, options);
  }

  addCron<T extends MessageQueueJobData | undefined>({
    jobName,
    data,
    options,
    jobId,
  }: {
    jobName: string;
    data: T;
    options: QueueCronJobOptions;
    jobId?: string;
  }): Promise<void> {
    // const jobName = fullJobName.split('.')[1];

    return this.driver.addCron({
      queueName: this.queueName,
      jobName,
      data,
      options,
      jobId,
    });
  }

  removeCron({
    jobName,
    jobId,
  }: {
    jobName: string;
    jobId?: string;
  }): Promise<void> {
    return this.driver.removeCron({
      queueName: this.queueName,
      jobName,
      jobId,
    });
  }

  work<T extends MessageQueueJobData>(
    handler: (job: MessageQueueJob<T>) => Promise<void> | void,
    options?: MessageQueueWorkerOptions,
  ) {
    return this.driver.work(this.queueName, handler, options);
  }
}
