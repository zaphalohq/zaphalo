import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { log } from "console";

@Injectable()
export class AuthService {
    constructor(
        private userservice : UserService,
        private jwtservice : JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userservice.findOneByUsername(username);
        const pass =  await this.userservice.findOneByPassword(password)
        if (user && pass) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
 
      async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
          access_token: this.jwtservice.sign(payload),
        };
      }
}