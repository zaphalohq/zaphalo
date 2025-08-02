import { Module } from '@nestjs/common';

import { SystemConfigResolver } from './system-config.resolver';
import { SystemConfigService } from 'src/modules/system-config/services/system-config.service';

@Module({
	imports: [],
	providers: [SystemConfigService, SystemConfigResolver],
})

export class SystemConfigModule {};