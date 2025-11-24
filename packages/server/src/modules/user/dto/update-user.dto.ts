import { InputType, ObjectType, Field } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class UpdateUserDTO {

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field()
    email: string;

    @Field({ nullable : true })
    profileImg?: string;
}
