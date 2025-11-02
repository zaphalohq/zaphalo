import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';

import { AccessTokenService } from 'src/modules/auth/token/services/access-token.service';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import {
  AuthContext,
} from 'src/modules/auth/types/auth-context.type';

@Injectable()
export class MiddlewareService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly jwtWrapperService: JwtWrapperService,
  ) {}

  public isTokenPresent(request: Request): boolean {
    const token = this.jwtWrapperService.extractJwtFromRequest()(request);
    return !!token;
  }


  public async hydrateRestRequest(request: Request) {
    const data = await this.accessTokenService.validateTokenByRequest(request);
    console.log("..........................data...........", data);
    // const metadataVersion = data.workspace
    //   ? await this.workspaceStorageCacheService.getMetadataVersion(
    //       data.workspace.id,
    //     )
    //   : undefined;

    // if (metadataVersion === undefined && isDefined(data.workspace)) {
    //   await this.workspaceMetadataCacheService.recomputeMetadataCache({
    //     workspaceId: data.workspace.id,
    //   });
    //   throw new Error('Metadata cache version not found');
    // }

    // const dataSourcesMetadata = data.workspace
    //   ? await this.dataSourceService.getDataSourcesMetadataFromWorkspaceId(
    //       data.workspace.id,
    //     )
    //   : undefined;

    // if (!dataSourcesMetadata || dataSourcesMetadata.length === 0) {
    //   throw new Error('No data sources found');
    // }

    this.bindDataToRequestObject(data, request);
  }

  private bindDataToRequestObject(
    data: AuthContext,
    request: Request,
    // metadataVersion: number | undefined,
  ) {
    request.user = data.user;
    request.workspace = data.workspace;
    request.workspaceMemberId = data.workspaceMemberId;
    request.authProvider = data.authProvider;
  }

}
