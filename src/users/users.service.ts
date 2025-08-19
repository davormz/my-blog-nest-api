import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  updateUser(id: number, user: UpdateUserDto): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } }).then((existingUser) => {
      if (existingUser) {
        Object.assign(existingUser, user);
        return this.usersRepository.save(existingUser);
      }
      return null;
    });
  }

  deleteUser(id: number): Promise<boolean> {
    return this.usersRepository.delete(id).then((result) => result.affected !== 0);
  }
}
