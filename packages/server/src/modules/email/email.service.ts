import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly domainManagerService: DomainManagerService,
  ) { }

  async sendUserWelcome(user: User, token: string) {
    const confirmation_url = this.domainManagerService.buildWorkspaceURL({
      pathname: 'auth/confirm',
      searchParams: {
        token,
      },
    });
  }
}