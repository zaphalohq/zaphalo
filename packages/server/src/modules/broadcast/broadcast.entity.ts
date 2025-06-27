import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { Workspace } from "src/modules/workspace/workspace.entity";
import { Template } from "src/modules/template/template.entity";
import { MailingList } from "src/modules/mailingList/mailingList.entity";


@Entity({ name: 'broadcast', schema: 'core' })
@ObjectType('broadcast')
export class Broadcast {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field(() => String)
  broadcastName: string;

  @OneToOne(() => Template)
  @JoinColumn()
  @Field(() => Template, { nullable: true })
  template: Relation<Template>;

  @OneToOne(() => MailingList)
  @JoinColumn()
  @Field(() => MailingList, { nullable: true })
  mailingList: Relation<MailingList>;

  @Column("text", { array: true, nullable: true })
  @Field(() => [String], { nullable: true })
  variables?: string[];

   @Column()
  @Field({ nullable: true })
  URL?: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  @Field(() => Boolean)
  isBroadcastDone: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Field(() => Workspace)
  @ManyToOne(() => Workspace)
  workspace: Relation<Workspace>


}