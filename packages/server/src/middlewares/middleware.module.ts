import { Module } from '@nestjs/common';

import { TokenModule } from 'src/modules/auth/token/token.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';
import { MiddlewareService } from 'src/middlewares/middleware.service';

@Module({
  imports: [
    TokenModule,
    JwtModule,
  ],
  providers: [MiddlewareService],
  exports: [MiddlewareService],
})
export class MiddlewareModule {}
