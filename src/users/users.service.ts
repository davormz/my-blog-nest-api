import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findUserById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  createUser(user: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<User | null> {
    const existingUser = await this.usersRepository.findOne({ where: { id }, relations: ['profile'] });
    if (existingUser) {
      Object.assign(existingUser, user);
      return this.usersRepository.save(existingUser);
    }
    return null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return result.affected !== 0;
  }

  async getUserProfile(id: number): Promise<Profile | null> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['profile'] });
    return user?.profile ?? null;
  }
}
