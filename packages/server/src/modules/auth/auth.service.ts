import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { WorkspaceService } from "../workspace/workspace.service";
import { Workspace } from "../workspace/workspace.entity";
import * as bcrypt from "bcrypt";
import { CreateUserDTO } from "../user/dto/create-user.dto";
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';
import { error } from "console";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "../user/user.entity";
import { addMilliseconds } from 'date-fns';
import { createHash } from 'crypto';
import ms from 'ms';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
    private readonly domainManagerService: DomainManagerService,
    private readonly workspaceService: WorkspaceService,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userservice.findOneByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async checkUserForSigninUp(username: string){
    const user = this.userservice.findOneByEmail(username);
    return user;
  }

  async login(user: any) {
    const workspaces = await this.workspaceService.getOrCreateWorkspaceForUser(user.id);
    const WorkspaceIds = workspaces.map(workspace => workspace.id);
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
      workspaceIds: WorkspaceIds,
      role: user.role
    };
    const users = await this.userservice.findByUserId(user.id)
    if(!users) throw error("this is error of")
      return {
        access_token: this.jwtService.sign(payload),
        workspaceIds: JSON.stringify(WorkspaceIds),
        userDetails : {
          name : users.username,
          email : users.email
        }
      };
    }

    async Register(register: CreateUserDTO): Promise<any> {
      // const username_validation = await this.userservice.findOneByUsername(register.username);
      const email_validation = await this.userservice.findOneByEmail(register.email);
      if (email_validation) {
        return "User already exists";
      }

    // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(register.password || 'Vipul@123', saltRounds);

    // Update the register object with the hashed password
      const userData = { ...register, password: hashedPassword, username: register.email };

      const user = await this.userservice.createUser(userData);
      return user;
    }


    computeRedirectURI({
      loginToken,
    }: {
      loginToken: string;
    }) {
      const url = this.domainManagerService.buildWorkspaceURL({
        // workspace,
        pathname: '/verify',
        searchParams: {
          loginToken,
        },
      });

      return url.toString();
    }

  async findWorkspaceForSignInUp(
    params: {
      workspaceInviteToken: string;
      userId: string
    } 
  ) {
    return this.workspaceService.getOrCreateWorkspaceForUser(params.userId, params.workspaceInviteToken)

  }

  generateAppSecret(type: string, workspaceId?: string): string {
    const appSecret = process.env.APP_SECRET;
    if (!appSecret) {
      throw new Error('APP_SECRET is not set');
    }

    return createHash('sha256')
      .update(`${appSecret}${workspaceId}${type}`)
      .digest('hex');
  }


  async generateLoginToken(
    email: string,
    workspaceId: string,
  ) {

      const secret = this.generateAppSecret(
        'LOGIN',
        workspaceId,
      );

      const expiresIn = '15m';

      const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));
      const jwtPayload = {
        sub: email,
        workspaceId,
      };

      const token = {
        token: this.jwtService.sign(jwtPayload, {
          secret,
          expiresIn,
        }),
        expiresAt,
      };

      return token;
  }
  decode<T = any>(payload: string, options?: jwt.DecodeOptions): T {
    return this.jwtService.decode(payload, options);
  }

  async verifyToken(loginToken: string){


    const decodeToken = this.decode(loginToken, {
      json: true,
    });

    const payload = this.jwtService.verify(loginToken, {
      secret: this.generateAppSecret('LOGIN', decodeToken.workspaceId),
    });

    const users = await this.userservice.findOneByEmail(payload.sub)
    if(!users) throw error("this is error of users")
    const payloadfinal = {
      username: users.username,
      sub: users.id,
      email: users.email,
      workspaceId: payload.workspaceId,
      workspaceIds: payload.workspaceId
    };

          const expiresIn = '15m';

      const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));

    return {
        access_token: this.jwtService.sign(payloadfinal),
        accessToken : {
          token : this.jwtService.sign(payloadfinal),
          expiresAt
        },
        workspaceIds: JSON.stringify(payload.workspaceId),
        userDetails: {
          name : users.username,
          email : users.email
        }
      };
  }

}