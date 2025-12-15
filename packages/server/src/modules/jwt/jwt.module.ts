/* eslint-disable no-restricted-imports */
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';

const InternalJwtModule = NestJwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('APP_SECRET'),
      signOptions: {
        expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      },
    };
  },
});

@Module({
  imports: [InternalJwtModule],
  controllers: [],
  providers: [JwtWrapperService],
  exports: [JwtWrapperService],
})
export class JwtModule {}
