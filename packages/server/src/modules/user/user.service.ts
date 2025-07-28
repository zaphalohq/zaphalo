import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService implements OnModuleInit  {
  constructor(
    @InjectRepository(User, 'core')
    private userRepository: Repository<User>,
  ) { }

  onModuleInit() {
    console.log(`The  user module has been initialized.`);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByUsername(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email }
    });
  }

  async findOneByPassword(password: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { password }
    })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['workspaces', 'workspaces.workspace'],
    })
    return user;
  }

  async createUser(CreateUserInput: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create(CreateUserInput)
    await this.userRepository.save(user)
    return user;
  }

  async findByUserId(userId): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['workspaces', 'workspaces.workspace'],
    })
  }

  async findOneUserWithWorkspaces(userId: string) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['workspaces', 'workspaces.workspace'],
    })
  }

}