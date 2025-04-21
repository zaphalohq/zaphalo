import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { Workspace } from "../workspace/workspace.entity";


@Entity({ name: 'instants', schema: 'core' })
@ObjectType('Instants')
export class WhatsappInstants {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()                                // Regular database column
  @Field()                                 // GraphQL field
  name: string;

  @Column()                                // Regular database column
  @Field()                                 // GraphQL field
  appId: string;

  @Column()
  @Field()
  phoneNumberId: string;

  @Column()
  @Field()
  businessAccountId: string ;

  @Column()
  @Field()
  accessToken: string ;

  @Column()
  @Field()
  appSecret: string ;

  @CreateDateColumn()
  @Field() // If using GraphQL
  createdAt: Date;

    @Field(() => Workspace)
    @ManyToOne(() => Workspace)
    workspace : Relation<Workspace>
}