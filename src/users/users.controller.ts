import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './user.dto';

interface User {
  id: number;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];

  @Get()
  findAll(): User[] {
    return this.users;
  }

  @Get(':id')
  findOne(@Param('id') id: number): User | undefined {
    const user = this.users.find((user) => user.id === +id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  create(@Body() user: CreateUserDto): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
    };
    this.users.push(newUser);
    return newUser;
  }

  @Delete(':id')
  delete(@Param('id') id: number): void {
    const userIndex = this.users.findIndex((user) => user.id === +id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: User): User {
    const userIndex = this.users.findIndex((user) => user.id === +id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = { ...this.users[userIndex], ...user };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }
}
