import { v4 } from 'uuid';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';
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

@Injectable()
export class SignInUpService {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly workspaceMemberService: WorkspaceMemberService,
    private readonly workspaceService: WorkspaceService,
  ) { }

  async computeParamsForNewUser(
    newUserParams: SignInUpNewUserPayload,
    authParams: AuthProviderWithPasswordType['authParams'],
  ) {
    if (!newUserParams.firstName) newUserParams.firstName = '';
    if (!newUserParams.lastName) newUserParams.lastName = '';

    if (!newUserParams?.email) {
      throw new Error('Email is required')
    }
    if (authParams.provider === 'password') {
      newUserParams.password = await this.generateHash(authParams.password);
    }

    return newUserParams as PartialUserWithPicture;
  }

  async generateHash(password: string) {
    const isPasswordValid = PASSWORD_REGEX.test(password);

    if (!isPasswordValid) {
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
    }
  }


  private async saveNewUser(
    newUserWithPicture: PartialUserWithPicture,
    workspaceId: string,
  ) {
    const userCreated = this.userRepository.create({
      ...newUserWithPicture,
    });

    return await this.userRepository.save(userCreated);
  }

  async signUpOnNewWorkspace(
    userData: ExistingUserOrPartialUserWithPicture['userData'],
  ) {
    const email =
      userData.type === 'newUserWithPicture'
        ? userData.newUserWithPicture.email
        : userData.existingUser.email;

    if (!email) {
      throw new Error('Email is required')
    }

    const workspaceToCreate = this.workspaceRepository.create({
      name: email,
      inviteToken: v4(),
    });

    const workspace = await this.workspaceRepository.save(workspaceToCreate);
    await this.workspaceService.createWorkspaceSchema(workspace);

    const user =
      userData.type === 'existingUser'
        ? userData.existingUser
        : await this.saveNewUser(userData.newUserWithPicture, workspace.id,
        );

    await this.workspaceMemberService.create(user.id, workspace.id);
    return { user, workspace };
  }


  async signInUpOnExistingWorkspace(
    params: {
      workspace: Workspace;
    } & ExistingUserOrPartialUserWithPicture,
  ) {
    const isNewUser = params.userData.type === 'newUserWithPicture';

    if (isNewUser) {
      const userData = params.userData as {
        type: 'newUserWithPicture';
        newUserWithPicture: PartialUserWithPicture;
      };

      const user = await this.saveNewUser(
        userData.newUserWithPicture,
        params.workspace.id,
      );
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
