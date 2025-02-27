import {
    Resolver,
    Query,
    Args,
    Parent,
    ResolveField,
    Mutation,
  } from '@nestjs/graphql';
  import { UseGuards } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  
  import crypto from 'crypto';
  
  // import { FileUpload, GraphQLUpload } from 'graphql-upload';
  import { Repository } from 'typeorm';
  
  // import { SupportDriver } from 'src/engine/integrations/environment/interfaces/support.interface';
  // import { FileFolder } from 'src/engine/core-modules/file/interfaces/file-folder.interface';
  
  // import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
  // import { EnvironmentService } from 'src/engine/integrations/environment/environment.service';
  // import { streamToBuffer } from 'src/utils/stream-to-buffer';
  // import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';
//   import { assert } from 'src/utils/assert';
  // import { DemoEnvGuard } from 'src/engine/guards/demo.env.guard';
  // import { JwtAuthGuard } from 'src/engine/guards/jwt.auth.guard';
  import { User } from './user.entity';
  // import { WorkspaceMember } from 'src/engine/core-modules/user/dtos/workspace-member.dto';
  
  import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { promises } from 'fs';
import { userDTO } from './dto/user.dto';
  
  const getHMACKey = (email?: string, key?: string | null) => {
    if (!email || !key) return null;
  
    const hmac = crypto.createHmac('sha256', key);
  
    return hmac.update(email).digest('hex');
  };
  // 
  // @UseGuards(JwtAuthGuard)
  @Resolver(() => User)
  export class UserResolver {
    constructor(
      @InjectRepository(User, 'core')
      private readonly userRepository: Repository<User>,
      private readonly userService: UserService,
      // private readonly environmentService: EnvironmentService,
      // private readonly fileUploadService: FileUploadService,
    ) {}
  
    @Query(() => [User])
    async findAll() : Promise<User[]>{
      return this.userService.findAll();
    }

    @Query(() => User)
    async findOneByUsername(@Args('username') username : string ) : Promise<User>{
      return this.userService.findOneByUsername(username);
    }

    @Query(() => User)
    async findOneByEmail( email : string) : Promise<User> {
      return this.userService.findOneByEmail(email)
    }

    @Mutation(() => User)
    async createUser(@Args('CreateUserInput') CreateUserInput : CreateUserDTO) : Promise<User> {
      return this.userService.createUser(CreateUserInput);
    }
    
    // @Query(() => User)
    // async currentUser(@Args('id') id: string): Promise<User> {
    //   console.log(".......currentUser............................")
    //   const user = await this.userRepository.findOne({
    //     where: {
    //       id: id,
    //     },
    //     // relations: ['defaultWorkspace', 'workspaces', 'workspaces.workspace'],
    //   });
  
    // //   assert(user, 'User not found');
  
    //   return user;
    // }
    // @Query(() => String)
    // async getUse(@Args('id') id: String): Promise<String>{
    //   return "";
    // }
  
    // @ResolveField(() => WorkspaceMember, {
    //   nullable: true,
    // })
    // async workspaceMember(
    //   @Parent() user: User,
    // ): Promise<WorkspaceMember | undefined> {
    //   return this.userService.loadWorkspaceMember(user);
    // }
  
    // @ResolveField(() => String, {
    //   nullable: true,
    // })
    // supportUserHash(@Parent() parent: User): string | null {
    //   if (this.environmentService.get('SUPPORT_DRIVER') !== SupportDriver.Front) {
    //     return null;
    //   }
    //   const key = this.environmentService.get('SUPPORT_FRONT_HMAC_KEY');
  
    //   return getHMACKey(parent.email, key);
    // }
  
    // @Mutation(() => String)
    // async uploadProfilePicture(
    //   @AuthUser() { id }: User,
    //   @Args({ name: 'file', type: () => GraphQLUpload })
    //   { createReadStream, filename, mimetype }: FileUpload,
    // ): Promise<string> {
    //   if (!id) {
    //     throw new Error('User not found');
    //   }
  
    //   const stream = createReadStream();
    //   const buffer = await streamToBuffer(stream);
    //   const fileFolder = FileFolder.ProfilePicture;
  
    //   const { paths } = await this.fileUploadService.uploadImage({
    //     file: buffer,
    //     filename,
    //     mimeType: mimetype,
    //     fileFolder,
    //   });
  
    //   return paths[0];
    // }
  
    // @UseGuards(DemoEnvGuard)
    // @Mutation(() => User)
    // async deleteUser(@AuthUser() { id: userId }: User) {
    //   // Proceed with user deletion
    //   return this.userService.deleteUser(userId);
    // }
  }
  