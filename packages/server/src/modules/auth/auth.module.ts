import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
// import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { JwtStrategy } from 'src/core/modules/auth/jwt.strategy';

@Module({
  imports: [
    UserModule,
    // PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register JWT strategy
    JwtModule.register({
      secret: 'secretKey', // Replace with your own secret
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, ],
  exports: [AuthService],
})
export class AuthModule {}