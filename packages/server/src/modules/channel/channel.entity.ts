import { IDField } from "@ptc-org/nestjs-query-graphql";
import { UUIDScalarType } from "src/modules/api/scalars/uuid.scalar";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name : 'channel', schema : 'core'})
export class Channel {
  @IDField(() => UUIDScalarType)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type : 'varchar', length: 255, nullable : true})
  channelName: string

  @Column("jsonb")
  memberIds: number[];

  @CreateDateColumn()
  createdAt : Date

  @UpdateDateColumn()
  writeDate: Date;

  @Column({ type: 'bigint' })
  writeUser: BigInt;  // ID of the user who last updated the channel.

  @Column({ type: 'bigint' })
  createUser: BigInt; 

}