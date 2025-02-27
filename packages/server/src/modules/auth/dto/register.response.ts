import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class RegisterResponse {
    // @Column()                                // Regular database column
    @Field()                                 // GraphQL field
    username: string;
  
    // @Column()
    @Field()
    email: string;
  
}