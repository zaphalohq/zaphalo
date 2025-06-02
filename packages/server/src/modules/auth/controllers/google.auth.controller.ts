import { Controller, UseGuards, Get, Req, Res, HttpStatus} from '@nestjs/common';
import { GoogleOauthGuard } from 'src/modules/auth/guards/google.auth.guard';
import { AuthService } from '../auth.service';
import { Response } from 'express';

@Controller('google/auth')
export class GoogleAuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  googleAuth(): string {
    return 'This action returns all cats';
  }


  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    console.log("...............req.user..................", req.user);
    const user = await this.authService.Register(req.user);
    // const user = await this.authService.Register(req.user);
    console.log("..............user...............", user);
    // res.cookie('access_token', token, {
    //   maxAge: 2592000000,
    //   sameSite: true,
    //   secure: false,
    // });

    return res.status(HttpStatus.OK);
  }
}
