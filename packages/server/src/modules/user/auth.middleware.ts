import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    console.log(".........................", token);
    if (token) {
      const decoded = this.decodeToken(token); // Implement JWT decoding
      req.user = decoded;
    }
    next();
  }

  private decodeToken(token: string): any {
    // Logic to decode JWT and retrieve user data
    return { roles: ['user'] }; // Example decoded payload
  }
}
