import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { UUIDScalarType } from "../../modules/api/scalars/uuid.scalar";
import { Workspace } from "../../modules/workspace/workspace.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

@Entity({ name: 'template'})
@ObjectType('Template')
export class Template {
    @IDField(() => UUIDScalarType)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Field()
    account: string;

    @Column()
    @Field()
    templateName: string;

    @Column()
    @Field()
    status: string;

    @Column()
    @Field()
    templateId: string;

    @Column()
    @Field()
    category: string;

    @Column()
    @Field()
    language: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    headerType: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    bodyText: string;


    @Column({ nullable: true })
    @Field({ nullable: true })
    footerText: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    header_handle: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    fileUrl: string;

    @Column('json', { nullable: true })
    @Field(() => [Button], { nullable: true })
    button: {
        type: string;
        text: string;
        url?: string;
        phone_number?: string;
    }[];

    @Column('json', { nullable: true })
    @Field(() => [Variable], { nullable: true })
    variables: {
        name: string;
        value: string;
    }[];

    // @Field(() => Workspace, { nullable: true })
    // @ManyToOne(() => Workspace, { nullable: true })
    // workspace: Relation<Workspace>

    @CreateDateColumn()
    createdAt: Date;
}


@ObjectType()
class Button {
  @Field()
  type: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  url?: string;

  @Field({ nullable: true })
  phone_number?: string;
}


@ObjectType()
class Variable {
  @Field()
  name: string;

  @Field()
  value: string;
}