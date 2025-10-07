import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class AddressInput {
  @Field({ nullable: true }) 
  street?: string;

  @Field({ nullable: true }) 
  landmark?: string;

  @Field({ nullable: true }) 
  city?: string;

  @Field({ nullable: true }) 
  state?: string;
  
  @Field({ nullable: true }) 
  pincode?: string;

  @Field({nullable:true})
  country?:string
}
