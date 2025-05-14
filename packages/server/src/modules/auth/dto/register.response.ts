import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class RegisterResponse {
  @Field()
  username: string;

  @Field()
  email: string;
}