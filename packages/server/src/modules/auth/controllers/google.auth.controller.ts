import { Controller, UseGuards, Get, Req, Res, HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleOauthGuard } from 'src/modules/auth/guards/google.auth.guard';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { User } from "src/modules/user/user.entity";


@Controller('google/auth')
export class GoogleAuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    return;
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const {
      firstName,
      lastName,
      email,
      picture,
      workspaceId,
      workspaceInviteToken,
      local,
    } = req.user;

    const currentWorkspace = await this.authService.findWorkspaceForSignInUp({
      workspaceId,
      workspaceInviteToken,
      email,
      authProvider: 'google',
    });
    console.log(currentWorkspace,"currentWorkspace..................currentWorkspace",req.user);
    
    try{
      const invitation =
        currentWorkspace && email
          ? await this.authService.findSignInUpInvitation({
              currentWorkspace,
              email,
            })
          : undefined;

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      const { userData } = this.authService.formatUserDataPayload(
        {
          firstName,
          lastName,
          email,
          picture,
          // locale,
        },
        existingUser,
      );

      // await this.authService.checkSignInAccess({
      //   userData,
      //   invitation,
      //   workspaceInviteHash,
      //   workspace: currentWorkspace,
      // });

      const { user, workspace } = await this.authService.signInUp({
        // invitation,
        workspace: currentWorkspace,
        userData,
        authParams: {
          provider: 'google',
        },
      });

      const loginToken = await this.authService.generateLoginToken(
        email,
        workspace.id,
      );
      return res.redirect(
        this.authService.computeRedirectURI({
          loginToken: loginToken.token,
      }));
    }
    catch(err){
      return res.redirect('/error'+err);
    }
    
  }
}
