export const QUEUE_DRIVER = Symbol('message-queue:queue_driver');
export const PROCESSOR_METADATA = Symbol('message-queue:processor_metadata');
export const PROCESS_METADATA = Symbol('message-queue:process_metadata');

export enum MessageQueue {
  sendWaQueue = 'send-wa-queue.SendWhatsAppMessageJob',
  waTmplSyncQueue = 'wa-tmpl-sync-queue.UpdateTemplateJob',

}