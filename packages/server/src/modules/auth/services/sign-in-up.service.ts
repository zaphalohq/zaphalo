import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Workspace } from 'src/modules/workspace/workspace.entity';
import { User } from 'src/modules/user/user.entity';
import { WorkspaceMemberService } from 'src/modules/workspace/workspaceMember.service';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';

import {
  PASSWORD_REGEX,
  compareHash,
  hashPassword,
} from 'src/modules/auth/auth.util';

import {
  AuthProviderWithPasswordType,
  ExistingUserOrPartialUserWithPicture,
  PartialUserWithPicture,
  SignInUpBaseParams,
  SignInUpNewUserPayload,
} from 'src/modules/auth/types/signInUp.type';
import { v4 } from 'uuid';


@Injectable()
export class SignInUpService {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async computeParamsForNewUser(
    newUserParams: SignInUpNewUserPayload,
    authParams: AuthProviderWithPasswordType['authParams'],
  ) {
    if (!newUserParams.firstName) newUserParams.firstName = '';
    if (!newUserParams.lastName) newUserParams.lastName = '';

    if (!newUserParams?.email) {
      // throw new AuthException(
      //   'Email is required',
      //   AuthExceptionCode.INVALID_INPUT,
      // );
      throw new Error('Email is required')
    }
    // newUserParams.username = newUserParams.email;
    if (authParams.provider === 'password') {
      newUserParams.password = await this.generateHash(authParams.password);
    }

    return newUserParams as PartialUserWithPicture;
  }

  async generateHash(password: string) {
    const isPasswordValid = PASSWORD_REGEX.test(password);

    if (!isPasswordValid) {
      // throw new AuthException(
      //   'Password too weak',
      //   AuthExceptionCode.INVALID_INPUT,
      // );
      throw new Error('Password too weak')

    }

    return await hashPassword(password);
  }


  async validatePassword({
    password,
    passwordHash,
  }: {
    password: string;
    passwordHash: string;
  }) {
    const isValid = await compareHash(password, passwordHash);

    if (!isValid) {
      throw new Error('Wrong password')

      // throw new AuthException(
      //   'Wrong password',
      //   AuthExceptionCode.FORBIDDEN_EXCEPTION,
      // );
    }
  }


  private async saveNewUser(
    newUserWithPicture: PartialUserWithPicture,
    workspaceId: string,
    // {
    //   canImpersonate,
    //   canAccessFullAdminPanel,
    // }: {
    //   canImpersonate: boolean;
    //   canAccessFullAdminPanel: boolean;
    // },
  ) {
    // const defaultAvatarUrl = await this.uploadPicture(
    //   newUserWithPicture.picture,
    //   workspaceId,
    // );
    const userCreated = this.userRepository.create({
      ...newUserWithPicture,
      // defaultAvatarUrl,
      // canImpersonate,
      // canAccessFullAdminPanel,
    });

    return await this.userRepository.save(userCreated);
  }

  async signUpOnNewWorkspace(
    userData: ExistingUserOrPartialUserWithPicture['userData'],
  ) {
    // let canImpersonate = false;
    // let canAccessFullAdminPanel = false;
    const email =
      userData.type === 'newUserWithPicture'
        ? userData.newUserWithPicture.email
        : userData.existingUser.email;

    if (!email) {
      // throw new AuthException(
      //   'Email is required',
      //   AuthExceptionCode.INVALID_INPUT,
      // );
      throw new Error('Email is required')
    }

    // if (!this.twentyConfigService.get('IS_MULTIWORKSPACE_ENABLED')) {
    //   const workspacesCount = await this.workspaceRepository.count();

    //   // if the workspace doesn't exist it means it's the first user of the workspace
    //   canImpersonate = true;
    //   canAccessFullAdminPanel = true;

    //   // let the creation of the first workspace
    //   if (workspacesCount > 0) {
    //     throw new AuthException(
    //       'New workspace setup is disabled',
    //       AuthExceptionCode.SIGNUP_DISABLED,
    //     );
    //   }
    // }

    // const logoUrl = `${TWENTY_ICONS_BASE_URL}/${getDomainNameByEmail(email)}`;
    // const isLogoUrlValid = async () => {
    //   try {
    //     return (
    //       (await this.httpService.axiosRef.get(logoUrl, { timeout: 600 }))
    //         .status === 200
    //     );
    //   } catch {
    //     return false;
    //   }
    // };

    // const isWorkEmailFound = isWorkEmail(email);
    // const logo =
    //   isWorkEmailFound && (await isLogoUrlValid()) ? logoUrl : undefined;

    const workspaceToCreate = this.workspaceRepository.create({
      // subdomain: await this.domainManagerService.generateSubdomain(
      //   isWorkEmailFound ? { email } : {},
      // ),
      name: email,
      inviteToken: v4(),
      // activationStatus: WorkspaceActivationStatus.PENDING_CREATION,
      // logo,
    });

    const workspace = await this.workspaceRepository.save(workspaceToCreate);
    console.log(workspace,'......................................workspace.......');
    
    await this.workspaceService.createWorkspaceSchema(workspace);
    

    const user =
      userData.type === 'existingUser'
        ? userData.existingUser
        : await this.saveNewUser(userData.newUserWithPicture, workspace.id, 
        // {
        //     canImpersonate,
        //     canAccessFullAdminPanel,
        //   }
          );

    await this.workspaceMemberService.create(user.id, workspace.id);

    // await this.activateOnboardingForUser(user, workspace);

    // await this.onboardingService.setOnboardingInviteTeamPending({
    //   workspaceId: workspace.id,
    //   value: true,
    // });

    return { user, workspace };
  }


  async signInUpOnExistingWorkspace(
    params: {
      workspace: Workspace;
    } & ExistingUserOrPartialUserWithPicture,
  ) {
    // await this.throwIfWorkspaceIsNotReadyForSignInUp(params.workspace, params);

    const isNewUser = params.userData.type === 'newUserWithPicture';

    if (isNewUser) {
      const userData = params.userData as {
        type: 'newUserWithPicture';
        newUserWithPicture: PartialUserWithPicture;
      };

      const user = await this.saveNewUser(
        userData.newUserWithPicture,
        params.workspace.id,
        // {
        //   canAccessFullAdminPanel: false,
        //   canImpersonate: false,
        // },
      );

      // await this.activateOnboardingForUser(user, params.workspace);

      await this.workspaceMemberService.addUserToWorkspaceIfUserNotInWorkspace(
        user,
        params.workspace,
      );

      return user;
    }

    const userData = params.userData as {
      type: 'existingUser';
      existingUser: User;
    };

    const user = userData.existingUser;

    await this.workspaceMemberService.addUserToWorkspaceIfUserNotInWorkspace(
      user,
      params.workspace,
    );

    return user;
  }

  async signInUp(
    params: SignInUpBaseParams &
      ExistingUserOrPartialUserWithPicture &
      AuthProviderWithPasswordType,
  ) {
    // if (params.workspace && params.invitation) {
    //   return {
    //     workspace: params.workspace,
    //     user: await this.signInUpWithPersonalInvitation({
    //       invitation: params.invitation,
    //       userData: params.userData,
    //     }),
    //   };
    // }
    if (params.workspace) {

      const updatedUser = await this.signInUpOnExistingWorkspace({
        workspace: params.workspace,
        userData: params.userData,
      });

      return { user: updatedUser, workspace: params.workspace };
    }
    return await this.signUpOnNewWorkspace(params.userData);
  }

 
}
