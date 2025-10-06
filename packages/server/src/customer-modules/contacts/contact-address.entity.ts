import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';

@ObjectType()
export class Address {
  @Column({ nullable: true })
  @Field({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  landmark?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  state?: string;

  @Column({nullable:true})
  @Field({nullable:true})
  country?:string

  @Column({ nullable: true })
  @Field({ nullable: true })
  pincode?: string;

}
