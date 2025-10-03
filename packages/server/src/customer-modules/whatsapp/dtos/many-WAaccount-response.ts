import { Field, ObjectType } from "@nestjs/graphql";
import { WhatsAppAccount } from "../entities/whatsapp-account.entity";

@ObjectType()
export class ManyAccountResponse {
  @Field(() => [WhatsAppAccount])
  accounts: WhatsAppAccount[];

  @Field()
  total: number;

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;
}