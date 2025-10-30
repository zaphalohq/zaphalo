import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { Workspace } from 'src/modules/workspace/workspace.entity';


@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
      @InjectRepository(Workspace, 'core')
      private readonly workspaceRepository: Repository<Workspace>,
      @InjectRepository(User, 'core')
      private readonly userRepository: Repository<User>,
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

    const userId = payload.sub ?? payload.userId;

    if (!userId) {
      throw new Error(
        'User not found',
      );
    }

    user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['workspaceMembers', 'workspaceMembers.workspace'],
    });

    if (!user) {
      throw new Error('User not found');
    }
    return { user, workspace, userId: payload.sub, userWorkspaceId: workspace.id, role: payload.role, workspaceIds: payload.workspaceIds};
  }
}