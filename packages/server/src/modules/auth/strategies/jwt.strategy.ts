import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(
  private usersService: UserService,
) {
   super({
     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     ignoreExpiration: false,
     secretOrKey: 'secretKey', // Replace with your own secret
   });
 }

 async validate(payload: any) {
  // const token = ExtractJwt.fromAuthHeaderAsBearerToken(); // Extract token

  // // Check if token is blacklisted
  // const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
  // if (isBlacklisted) {
  //   throw new UnauthorizedException('Token is blacklisted');
   return { userId: payload.sub, username: payload.username };
 }
}