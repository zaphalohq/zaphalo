import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { MiddlewareService } from 'src/middlewares/middleware.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly middlewareService: MiddlewareService,
  ) {}

  async use(request: Request, res: Response, next: NextFunction) {
    try {
      await this.middlewareService.hydrateGraphqlRequest(request);
    } catch (error) {
      this.middlewareService.writeGraphqlResponseOnExceptionCaught(res, error);
      return;
    }
    next();
  }
}
