import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { WorkspaceService } from "../workspace/workspace.service";
import { Workspace } from "../workspace/workspace.entity";
import * as bcrypt from "bcrypt";
import { CreateUserDTO } from "../user/dto/create-user.dto";
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';
import { error } from "console";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "../user/user.entity";


@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtservice: JwtService,
    private readonly domainManagerService: DomainManagerService,
    private readonly workspaceService: WorkspaceService,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userservice.findOneByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async checkUserForSigninUp(username: string){
    const user = this.userservice.findOneByEmail(username);
    return user;
  }

  async login(user: any) {
    const workspaces = await this.workspaceService.getOrCreateWorkspaceForUser(user.id);
    const WorkspaceIds = workspaces.map(workspace => workspace.id);
    const payload = { username: user.username, sub: user.id, workspaceIds: WorkspaceIds, role: user.role};
    const users = await this.userservice.findByUserId(user.id)
    if(!users) throw error("this is error of")
      return {
        access_token: this.jwtservice.sign(payload),
        workspaceIds: JSON.stringify(WorkspaceIds),
        userDetails : {
          name : users.username,
          email : users.email
        }
      };
    }

    async Register(register: CreateUserDTO): Promise<any> {
      console.log(".............register..............", register);
      // const username_validation = await this.userservice.findOneByUsername(register.username);
      const email_validation = await this.userservice.findOneByEmail(register.email);
      if (email_validation) {
        return "User already exists";
      }

    // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(register.password || 'Vipul@123', saltRounds);

    // Update the register object with the hashed password
      const userData = { ...register, password: hashedPassword, username: register.email };

      const user = await this.userservice.createUser(userData);
      return user;
    }


    computeRedirectURI({
      // loginToken,
      // workspace,
      // billingCheckoutSessionState,
    }: {
      // loginToken: string;
      // workspace: WorkspaceSubdomainCustomDomainAndIsCustomDomainEnabledType;
      // billingCheckoutSessionState?: string;
    }) {
      const url = this.domainManagerService.buildWorkspaceURL({
        // workspace,
        pathname: '/verify',
        // searchParams: {
        //   loginToken,
        //   ...(billingCheckoutSessionState ? { billingCheckoutSessionState } : {}),
        // },
      });

      return url.toString();
    }

  async findWorkspaceForSignInUp(
    params: {
      // workspaceId?: string;
      workspaceInviteToken: string;
      // email: string,
      // authProvider: string,
      userId: string
    } 
    // & (
    //   | {
    //       authProvider: Exclude<WorkspaceAuthProvider, 'password'>;
    //       email: string;
    //     }
    //   | { authProvider: Extract<WorkspaceAuthProvider, 'password'> }
    // ),
  ) {
    // if (params.workspaceInviteToken) {
    //   return (
    //     (await this.workspaceRepository.findOne({
    //       where: {
    //         inviteHash: params.workspaceInviteHash,
    //       },
    //       relations: ['workspaceId'],
    //     })) ?? undefined
    //   );
    // }
    return this.workspaceService.getOrCreateWorkspaceForUser(params.userId, params.workspaceInviteToken)

    // if (params.authProvider !== 'password') {
    //   console.log(".................findWorkspaceForSignInUp...3...........");

    //   return (
    //     (await this.authSsoService.findWorkspaceFromWorkspaceIdOrAuthProvider(
    //       {
    //         email: params.email,
    //         authProvider: params.authProvider,
    //       },
    //       params.workspaceId,
    //     )) ?? undefined
    //   );
    // }
    // console.log(".................findWorkspaceForSignInUp...4...........");
    // return params.workspaceId
    //   ? await this.workspaceRepository.findOne({
    //       // where: {
    //       //   id: params.workspaceId,
    //       // },
    //       // relations: ['approvedAccessDomains'],
    //     })
    //   : undefined;

    // return await this.workspaceRepository.findOne({
    //     where: {
    //       // id: params.workspaceId,
    //       id: '6153c5ba-b0a0-4f5c-9732-fc2a56e0e4e2',
    //     },
    //     // relations: ['id'],
    //   });
  }


  // async signInUp(
  //   params: {
  //     // invitation: string,
  //     workspace?: Workspace | null,
  //     userData: {
  //       email: string;
  //       firstName?: string | null;
  //       lastName?: string | null;
  //     },
  //     authParams: {provider: string},
  //     // owner?: User | null;
  //   }
  // ){
  //   console.log("................................", params);
  //   // var user = params.owner;
  //   if (!user){
  //           const saltRounds = 10;
  //     const hashedPassword = await bcrypt.hash(params.userData.email, saltRounds);
  //     const userData = { ...params.userData, username: params.userData.email, password: hashedPassword };

  //     const user = await this.userservice.createUser(userData);
  //   } 

  //   return user;
  //   // if (!user) {
  //   //   throw new Error('User not found');
  //   // }

  //   // if (params.workspace == null){
  //   //   const workspace2 = this.workspaceRepository.create({
  //   //     // name: params.userData.firstName | params.userData.email, // Default name as phoneNo
  //   //     name: `${params.userData.email}'s Workspace`,
  //   //     owner: user,
  //   //   })
  //   //   await this.workspaceRepository.save(workspace2);
  //   //   console.log("...............workspace............", workspace2);
  //   // }
  // }

}