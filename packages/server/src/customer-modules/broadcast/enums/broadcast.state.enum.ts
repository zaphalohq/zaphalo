import { registerEnumType } from "@nestjs/graphql";

export enum broadcastStates {
  new = "New",
  scheduled = "Scheduled",
  in_progress = "In Progress",
  done = "Completed",
  cancel = "Cancelled",
  failed = "Failed",
}

registerEnumType(broadcastStates, { name: 'messageStates' });