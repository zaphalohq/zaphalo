import { Field, ObjectType } from "@nestjs/graphql";
import { WhatsAppAccount } from "src/customer-modules/whatsapp/entities/whatsapp-account.entity";

@ObjectType()
export class WaAccountResponse {
  @Field(() => WhatsAppAccount, { nullable: true })
  waAccount: WhatsAppAccount;

  @Field()
  status: boolean;

  @Field()
  message: string;
}
