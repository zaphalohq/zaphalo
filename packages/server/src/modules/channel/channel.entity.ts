import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IDField } from '@ptc-org/nestjs-query-graphql';
import { UUIDScalarType } from 'src/modules/api/scalars/uuid.scalar'; // Ensure this path is correct
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Message } from './message.entity';
import { Contacts } from '../contacts/contacts.entity';

@Entity({ name: 'channel', schema: 'core' })
@ObjectType()
export class Channel {
  @IDField(() => UUIDScalarType) // Custom UUID scalar
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { nullable: true }) // Explicitly typed as String
  @Column({ type: 'varchar', length: 255, nullable: true })
  channelName: string;

  @Field(() => [Contacts]) // Array of integers
  @ManyToMany(() => Contacts, contacts => contacts.channel)
  @JoinTable({
    name: 'channel_contacts',
    joinColumn: { name: 'channelId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contactId', referencedColumnName: 'id' },
  })
  contacts: Contacts[];

  @Field(() => String) // Date as ISO string in GraphQL
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String) // Date as ISO string in GraphQL
  @UpdateDateColumn()
  writeDate: Date;

  @Field(() => Float) // Use Int for simplicity
  @Column({ type: 'bigint' })
  writeUser: number;

  @Field(() => String) // BigInt as String to avoid GraphQL limitations
  @Column({ type: 'bigint' })
  createUser: bigint; // Lowercase 'bigint' for TypeScript type

  @Field(() => [Message])
  @OneToMany(() => Message, message => message.channel)
  messages : Message[]
}