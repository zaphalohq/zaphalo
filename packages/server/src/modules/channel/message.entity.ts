import { Field } from '@nestjs/graphql';
import { Contacts } from 'src/modules/contacts/contacts.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { UUIDScalarType } from '../api/scalars/uuid.scalar';
import { IDField } from '@ptc-org/nestjs-query-graphql';

@Entity({ name : 'messages', schema :'core'})
export class Message {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  msg: string; 

  @ManyToOne(() => Channel) // Links message to a channel
  @JoinColumn({ name: 'channelId' })
  channel: Channel; // References the Channel entity (foreign key)

  @ManyToOne(() => Contacts, contacts => contacts.messages, { onDelete : 'SET NULL'}) // Many messages belong to one sender
  @JoinColumn({ name: 'senderid' }) // Foreign key column 'senderid'
  senderId: Contacts; // References the User entity (foreign key)

  @Column({ nullable: true })
  attachment: string; 

  @CreateDateColumn()
  createdAt: Date;
}
