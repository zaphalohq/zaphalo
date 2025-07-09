import { Resolver, Mutation, Query } from '@nestjs/graphql';


@Resolver()
export class SystemConfigResolver{

	@Query(() => String)
	getSystemStatus(){
		return "All Ok!!"
	}

}