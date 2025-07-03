import { Injectable } from '@nestjs/common';                // Marks class as a service
import { InjectRepository } from '@nestjs/typeorm';        // Injects repository
import { Repository } from 'typeorm';                      // TypeORM repository type
import { User } from 'src/modules/user/user.entity';                      // Our User entity
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
// import { userDTO } from './dto/user.dto';

@Injectable()                              // Makes this service injectable into other classes
export class UserService {
  constructor(
    @InjectRepository(User, 'core')                // Inject User repository
    private userRepository: Repository<User>,  // Repository for database operations
  ) {}

  // Method to get all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();     // SELECT * FROM user
  }

  async findOneByUsername(email: string): Promise<User | null> {
    return this.userRepository.findOne( {
      where : { email }
    });
  }

  async findOneByPassword(password: string) : Promise<User | null> {
    return this.userRepository.findOne({
      where : { password }
    })
  }
  

  async findOneByEmail(email: string ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where : { email } ,
      relations: ['workspaces', 'workspaces.workspace'],
    })
    return user;
  }

  async createUser(CreateUserInput : CreateUserDTO ) : Promise<User> {
    const user = this.userRepository.create(CreateUserInput)
    await this.userRepository.save(user)
    return user;
  }

  async findByUserId(userId): Promise<User | null>{
    return await this.userRepository.findOne({
      where : { id : userId},
      relations: ['workspaces', 'workspaces.workspace'],
    })
  }

  async findOneUserWithWorkspaces(userId : string) {
    return await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['workspaces', 'workspaces.workspace'],
      })
  }

}