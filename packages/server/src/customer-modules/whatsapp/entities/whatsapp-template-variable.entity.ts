import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { WhatsAppTemplate } from "./whatsapp-template.entity";

export enum VariableType {
    STATIC = "STATIC",
    DYNAMIC = "DYNAMIC",
}
registerEnumType(VariableType, { name: "VariableType" });

@Entity({ name: 'whatsappTemplateVariable' })
@ObjectType()
export class Variable {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => UUIDScalarType)
    id: string;

    @Column()
    @Field()
    name: string;

    @Field(() => VariableType)
    @Column({
    type: "enum",
    enum: VariableType,
    default: VariableType.STATIC,
    })
    type: VariableType;

    @Column({ nullable: true })
    @Field({ nullable: true })
    value: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    dynamicField: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    sampleValue: string;

    @ManyToOne(() => WhatsAppTemplate, (template) => template.variables, { onDelete: 'CASCADE' })
    template: Relation<WhatsAppTemplate>;

}