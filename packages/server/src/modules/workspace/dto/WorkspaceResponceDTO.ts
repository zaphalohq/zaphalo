import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class WorkspaceResponceDTO {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable : true })
  profileImg?: string;
  
}
