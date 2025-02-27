import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { log } from 'console';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('fdsfsdfsdfsdd');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false,    
      secretOrKey: 'secretKey', // Replace with your own secret
    });
  }

  async validate(payload: any) {
    console.log("............",payload );
    // return payload
    return { userId: payload.sub, username: payload.username };
  }
}