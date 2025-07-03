import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private readonly domainManagerService: DomainManagerService,
  ) {}

  async sendUserWelcome(user: User, token: string) {
    const confirmation_url = this.domainManagerService.buildWorkspaceURL({
      // workspace,
      pathname: 'auth/confirm',
      searchParams: {
        token,
      },
    });
    // const confirmation_url = `example.com/auth/confirm?token=${token}`;

    // await this.mailerService.sendMail({
    //   to: user.email,
    //   // from: '"Support Team" <support@example.com>', // override default from
    //   subject: 'Welcome to YaariAPI! Confirm your Email',
    //   template: './welcome', // `.ejs` extension is appended automatically
    //   context: { // filling <%= %> brackets with content
    //     name: user.firstName,
    //     confirmation_url,
    //   },
    // });
  }
}