import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];

  findAllUsers(): User[] {
    return this.users;
  }

  findUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(user: CreateUserDto): User {
    const newUser: User = {
      id: this.users.length + 1,
      name: user.name,
      email: user.email || '',
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, user: UpdateUserDto): User | undefined {
    const existingUser = this.findUserById(id);
    if (existingUser) {
      Object.assign(existingUser, user);
      return existingUser;
    }
    return undefined;
  }

  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}
