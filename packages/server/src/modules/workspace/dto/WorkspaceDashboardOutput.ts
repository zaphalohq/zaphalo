import { ObjectType, Field } from '@nestjs/graphql';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { Contacts } from 'src/modules/contacts/contacts.entity';

@ObjectType()
export class WorkspaceDashboardOutput {
  @Field(() => Workspace)
  workspace: Workspace;

  @Field(() => [Contacts])
  contacts: Contacts[];
}