import { registerEnumType } from "@nestjs/graphql";

export enum broadcastStates {
  draft = 'Draft',
  scheduled = 'Scheduled',
  queued = 'Queued',
  sending = 'Sending',
  sent = 'Sent',
  partially_sent = 'Partially Sent',
  error = 'Failed',
  cancel = 'Cancelled',
}

registerEnumType(broadcastStates, { name: 'messageStates' });