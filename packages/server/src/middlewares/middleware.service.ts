import { Injectable } from '@nestjs/common';

import { Request, Response } from 'express';

import { AccessTokenService } from 'src/modules/auth/token/services/access-token.service';
import { ExceptionHandlerService } from 'src/modules/exception-handler/exception-handler.service';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import {
  AuthContext,
} from 'src/modules/auth/types/auth-context.type';
import { AuthException } from 'src/modules/auth/auth.exception';
import { AuthGraphqlApiExceptionFilter } from 'src/modules/auth/filters/auth-graphql-api-exception.filter';
import {
  handleException,
  handleExceptionAndConvertToGraphQLError,
} from 'src/utils/global-exception-handler.util';

@Injectable()
export class MiddlewareService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly exceptionHandlerService: ExceptionHandlerService,
  ) {}

  public isTokenPresent(request: Request): boolean {
    const token = this.jwtWrapperService.extractJwtFromRequest()(request);
    return !!token;
  }

  public async hydrateRestRequest(request: Request) {
    const data = await this.accessTokenService.validateTokenByRequest(request);
    this.bindDataToRequestObject(data, request);
  }

  private bindDataToRequestObject(
    data: AuthContext,
    request: Request,
  ) {
    request.user = data.user;
    request.workspace = data.workspace;
    request.workspaceMemberId = data.workspaceMemberId;
    request.authProvider = data.authProvider;
  }

  public async hydrateGraphqlRequest(request: Request) {
    if (!this.isTokenPresent(request)) {
      return;
    }

    const data = await this.accessTokenService.validateTokenByRequest(request);

    this.bindDataToRequestObject(data, request);
  }

  public writeGraphqlResponseOnExceptionCaught(res: Response, error: any) {
    let errors;
    if (error instanceof AuthException) {
      try {
        const authFilter = new AuthGraphqlApiExceptionFilter();

        authFilter.catch(error);
      } catch (transformedError) {
        errors = [transformedError];
      }
    } else {
      errors = [
        handleExceptionAndConvertToGraphQLError(
          error as Error,
          this.exceptionHandlerService,
        ),
      ];
    }
    console.log(".............errors.............", errors);
    const statusCode = 401;

    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });

    res.write(
      JSON.stringify({
        error,
      }),
    );

    res.end();
  }
}
