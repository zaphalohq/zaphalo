import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { WorkspaceService } from "../workspace/workspace.service";
import * as bcrypt from "bcrypt";
import { CreateUserDTO } from "../user/dto/create-user.dto";
import { error } from "console";

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtservice: JwtService,
    private readonly workspaceService: WorkspaceService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userservice.findOneByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const workspaces = await this.workspaceService.getOrCreateWorkspaceForUser(user.id);
    const WorkspaceIds = workspaces.map(workspace => workspace.id);
    const payload = { username: user.username, sub: user.id, workspaceIds: WorkspaceIds };
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
      const username_validation = await this.userservice.findOneByUsername(register.username);
      const email_validation = await this.userservice.findOneByEmail(register.email);
      if (username_validation || email_validation) {
        return "User already exists";
      }

    // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(register.password, saltRounds);

    // Update the register object with the hashed password
      const userData = { ...register, password: hashedPassword };

      const user = await this.userservice.createUser(userData);
      return user;
    }
  }