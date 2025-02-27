import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { log } from "console";
import { CreateUserDTO } from "../user/dto/create-user.dto";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtservice: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userservice.findOneByUsername(username);
    const pass = await this.userservice.findOneByPassword(password)
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


  async Register(Register : any): Promise<any>    {
    const username_validation = await this.userservice.findOneByUsername(Register.username);
    const email_validation = await this.userservice.findOneByEmail(Register.email);
    if(username_validation || email_validation){
      return "user already exist"
    }
    const user = await this.userservice.createUser(Register)  
    
    return user;
    }
  }
