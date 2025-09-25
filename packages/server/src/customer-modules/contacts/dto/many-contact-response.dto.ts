import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Contacts } from "../contacts.entity";


@ObjectType()
export class ManyContactResponse {

    @Field(() => [Contacts])
    contacts: Contacts[];

    @Field(() => Int)
    currentPage: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Int)    
    total: number;
}