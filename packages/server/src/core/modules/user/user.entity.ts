import { Field, ObjectType } from '@nestjs/graphql';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  Relation,
} from 'typeorm';
import { IDField } from '@ptc-org/nestjs-query-graphql';

// import { AppToken } from 'src/constro/modules/app-token/app-token.entity';
// import { Workspace } from 'src/constro/modules/workspace/workspace.entity';
// import { WorkspaceMember } from 'src/constro/modules/user/dtos/workspace-member.dto';
// import { UserWorkspace } from 'src/constro/modules/user-workspace/user-workspace.entity';
// import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';

import { GraphQLScalarType, Kind } from 'graphql';
import { validate as uuidValidate } from 'uuid';

const checkUUID = (value: any): string => {
  if (typeof value !== 'string') {
    throw new Error('UUID must be a string');
  }
  if (!uuidValidate(value)) {
    throw new Error('Invalid UUID');
  }

  return value;
};

export const UUIDScalarType = new GraphQLScalarType({
  name: 'UUID',
  description: 'A UUID scalar type',
  serialize: checkUUID,
  parseValue: checkUUID,
  parseLiteral(ast): string {
    if (ast.kind !== Kind.STRING) {
      throw new Error('UUID must be a string');
    }

    return ast.value;
  },
});



@Entity({ name: 'user', schema: 'core' })
@ObjectType('User')
export class User {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()                                // Regular database column
  @Field()                                 // GraphQL field
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string ;
}