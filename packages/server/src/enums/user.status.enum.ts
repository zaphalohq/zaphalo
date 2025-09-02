import { registerEnumType } from '@nestjs/graphql';

export enum UserStatus {
  ACTIVE = 'active',
  DEACTIVE = 'deactive',
}

registerEnumType(UserStatus, { name: 'UserStatus' });