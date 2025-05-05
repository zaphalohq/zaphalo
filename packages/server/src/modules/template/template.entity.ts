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

    @Column()                                // Regular database column
    @Field()                                 // GraphQL field
    templateName: string;

    @Column()                                // Regular database column
    @Field()                                 // GraphQL field
    status: string;

    @Column()
    @Field()
    templateId: string;

    @Column()
    @Field()
    category: string;

    @Field(() => Workspace, { nullable : true})
    @ManyToOne(() => Workspace, {nullable : true})
    workspace: Relation<Workspace>

    @CreateDateColumn()
    @Field() // If using GraphQL
    createdAt: Date;


}