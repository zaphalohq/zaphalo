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
import { INTERNAL_SERVER_ERROR } from 'src/middlewares/constants/default-error-message.constant';
import { isDefined } from 'src/utils/isDefined';
import { type CustomException } from 'src/utils/custom-exception';
import { ErrorCode } from 'src/modules/graphql/utils/graphql-errors.util';
import { getAuthExceptionRestStatus } from 'src/modules/auth/utils/get-auth-exception-rest-status.util';


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
    request.workspaceId = data.workspace?.id;
    request.workspaceMemberId = data.workspaceMemberId;
    request.authProvider = data.authProvider;
    request.userWorkspace=data.userWorkspace;
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
    
    const statusCode = 200;

    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });

    res.write(
      JSON.stringify({
        errors,
      }),
    );

    res.end();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public writeRestResponseOnExceptionCaught(res: Response, error: any) {
    const statusCode = this.getStatus(error);

    // capture and handle custom exceptions
    handleException({
      exception: error as CustomException,
      exceptionHandlerService: this.exceptionHandlerService,
      statusCode,
    });

    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        statusCode,
        messages: [error?.message || INTERNAL_SERVER_ERROR],
        error: error?.code || ErrorCode.INTERNAL_SERVER_ERROR,
      }),
    );

    res.end();
  }
  private hasErrorStatus(error: unknown): error is { status: number } {
    return isDefined((error as { status: number })?.status);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getStatus(error: any): number {
    if (this.hasErrorStatus(error)) {
      return error.status;
    }

    if (error instanceof AuthException) {
      return getAuthExceptionRestStatus(error);
    }

    return 500;
  }

  public async httpHydrateRestRequest(request: Request) {
    this.httpBindDataToRequestObject(request);
  }

  private httpBindDataToRequestObject(
    request: Request,
  ) {
    request.workspaceId = request.params.path[0];
  }
}
