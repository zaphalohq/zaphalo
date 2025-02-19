import { Injectable } from '@nestjs/common';                // Marks class as a service
import { InjectRepository } from '@nestjs/typeorm';        // Injects repository
import { Repository } from 'typeorm';                      // TypeORM repository type
import { User } from './user.entity';                      // Our User entity
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

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne( {
      where : { username }
    });
      
  }

  async findOneByEmail(email: string ): Promise<User | undefined> {
    return this.userRepository.findOne( { 
      where : { email } 
    });
  }

  async createUser(CreateUserInput : CreateUserDTO ) : Promise<User | undefined> {
    const user = this.userRepository.create(CreateUserInput)
    await this.userRepository.save(user)
    return user;
    }
}