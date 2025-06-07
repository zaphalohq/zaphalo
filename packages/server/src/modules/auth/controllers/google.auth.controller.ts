import { Controller, UseGuards, Get, Req, Res, HttpStatus} from '@nestjs/common';
import { GoogleOauthGuard } from 'src/modules/auth/guards/google.auth.guard';
import { AuthService } from '../auth.service';
import { Response } from 'express';

@Controller('google/auth')
export class GoogleAuthController {
  constructor(private authService: AuthService) {}

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
      workspaceInviteToken,
      locale,
    } = req.user;

    var isUserExist = await this.authService.checkUserForSigninUp(email)

    const userData = {
      email,
      firstName,
      lastName,
    }
    if (isUserExist == null){
      isUserExist = await this.authService.Register(req.user);
    }

    if (!isUserExist) {
      throw new Error('Invalid or expired invitation');
    }
    const userId = isUserExist.id
    const currentWorkspace = await this.authService.findWorkspaceForSignInUp({
      workspaceInviteToken,
      userId,
      // email,
      // authProvider: 'google',
    });

    const loginToken = await this.authService.generateLoginToken(
      email,
      currentWorkspace[0].id,
    );
    
    return res.redirect(
      this.authService.computeRedirectURI({
        loginToken: loginToken.token,
        // workspace,
        // billingCheckoutSessionState,
      }),
    );
  }
}
