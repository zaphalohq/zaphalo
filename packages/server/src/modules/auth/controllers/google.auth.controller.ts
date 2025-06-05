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
      // workspaceId,
      // billingCheckoutSessionState,
      locale,
    } = req.user;


    console.log("..............workspaceInviteToken...........", workspaceInviteToken);
    var isUserExist = await this.authService.checkUserForSigninUp(email)
    

    const userData = {
      email,
      firstName,
      lastName,
    }
    if (isUserExist == null){
      isUserExist = await this.authService.Register(req.user);
      // isUserExist = await this.authService.signInUp({
      //   // invitation,
      //   // workspace: workspaceInviteToken,
      //   userData,
      //   authParams: {
      //     provider: 'google',
      //   },
      //   // owner: isUserExist,
      // });
    }
    console.log("...................isUserExist............", isUserExist);
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
    
    // const user = await this.authService.Register(req.user);
    // console.log("..............user...............", user);
    // res.cookie('access_token', token, {
    //   maxAge: 2592000000,
    //   sameSite: true,
    //   secure: false,
    // });
    const url = this.authService.computeRedirectURI({
          // loginToken: loginToken.token,
          // workspace,
          // billingCheckoutSessionState,
        });
      return res.redirect(
        this.authService.computeRedirectURI({
          // loginToken: loginToken.token,
          // workspace,
          // billingCheckoutSessionState,
        }),
      );

    // return res.status(HttpStatus.OK);
  }
}
