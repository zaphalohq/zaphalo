
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class MailingContact {
  @Field({ nullable : true })
  id?: string;
  
  @Field()
  contactName: string;

  @Field()
  contactNo: string;

  @Field()
  mailingListId : string;
}

@InputType()
export class MailingListInputDto {
  @Field(() => [MailingContact])
  mailingContacts: MailingContact[];
}
