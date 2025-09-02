import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
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
      secretOrKey: 'secretKey',
    });
  }
  async validate(payload: any) {
    let user: User | null = null;
    const workspace = await this.workspaceRepository.findOneBy({
      id: payload['workspaceId'],
    });
    if (!workspace) {
      throw new Error('Workspace not found');
    }


    user = await this.usersService.findByUserId(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return { user, workspace, userId: payload.sub, role: payload.role, workspaceIds: payload.workspaceIds};
  }
}