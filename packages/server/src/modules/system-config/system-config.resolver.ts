import { Resolver, Mutation, Query } from '@nestjs/graphql';

import { SystemConfigService } from 'src/modules/system-config/services/system-config.service';
import { SystemConfig } from 'src/modules/system-config/dtos/system-config.dto';


@Resolver()
export class SystemConfigResolver{
	constructor(private systemConfigService: SystemConfigService,){
	}

	@Query(() => SystemConfig)
	systemConfig(){
		return this.systemConfigService.getSystemConfigApiStatus()
	}
}