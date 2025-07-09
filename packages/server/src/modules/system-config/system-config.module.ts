import { Module } from '@nestjs/common';

import { SystemConfigResolver } from './system-config.resolver';

@Module({
	imports: [],
	providers: [SystemConfigResolver],
})

export class SystemConfigModule {};