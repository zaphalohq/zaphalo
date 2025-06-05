
import { InputType, Field } from '@nestjs/graphql';

@InputType()
class MailingContact {
  @Field()
  contactName: string;

  @Field()
  contactNo: string;
}

@InputType()
export class MailingListInputDto {
  @Field(() => [MailingContact])
  mailingContacts: MailingContact[];
}
