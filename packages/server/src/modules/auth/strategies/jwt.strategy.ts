import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UserService,
      @InjectRepository(Workspace, 'core')
      private readonly workspaceRepository: Repository<Workspace>,
    ){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // Replace with your own secret
    });
  }
  async validate(payload: any) {
    let user: User | null = null;
    const workspace = await this.workspaceRepository.findOneBy({
      id: payload['workspaceId'],
    });

    console.log(workspace,'......workspace....................');
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }


    user = await this.usersService.findByUserId(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
console.log(user,"......................user.........");

    return { user, workspace, userId: payload.sub, role: payload.role, workspaceIds: payload.workspaceIds};
  }
}