import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteInstantsDTO {
  
    @Field()
  id: string;
}