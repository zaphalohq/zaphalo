import { Field, ObjectType } from "@nestjs/graphql";
import { Contacts } from "../contacts.entity";


@ObjectType()
export class ContactResponse {
  @Field(() => Contacts, { nullable: true })
  broadcast?: Contacts;

  @Field()
  status: boolean;

  @Field()
  message: string;
}
