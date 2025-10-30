import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

import { SystemConfig } from 'src/modules/system-config/dtos/system-config.dto';

@Injectable()
export class SystemConfigService  {
  constructor(
    private configService: ConfigService
  ) { }

  getSystemConfigApiStatus(){
    const systemConfig: SystemConfig = {
      authProviders: {
        google: JSON.parse(this.configService.get('GOOGLE_AUTH_ENABLED') || "false")
      }
    }

    return systemConfig;
  }
}