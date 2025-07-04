import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class WorkspaceUpdateInputDto {
  @Field()
  workspaceId: string;

  @Field()
  workspaceName: string;

  @Field()
  profileImg: string;

}
