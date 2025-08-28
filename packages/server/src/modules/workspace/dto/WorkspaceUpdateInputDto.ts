import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class WorkspaceUpdateInputDto {
  @Field({ nullable : true })
  workspaceId?: string;

  @Field()
  workspaceName: string;

  @Field({ nullable : true })
  profileImg?: string;

}
