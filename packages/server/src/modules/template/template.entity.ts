import { Field, ObjectType } from "@nestjs/graphql";
import { IDField } from "@ptc-org/nestjs-query-graphql";
import { GraphQLScalarType, Kind } from "graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { UUIDScalarType } from "../api/scalars/uuid.scalar";
import { Workspace } from "../workspace/workspace.entity";


@Entity({ name: 'template', schema: 'core' })
@ObjectType('Template')
export class Template {
    @IDField(() => UUIDScalarType)
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

//     language: string

// headerFormat: string
// headerText: string
// footerText
// bodyText
    @Field(() => Workspace, { nullable : true})
    @ManyToOne(() => Workspace, {nullable : true})
    workspace: Relation<Workspace>

    @CreateDateColumn()
    @Field()
    createdAt: Date;


}