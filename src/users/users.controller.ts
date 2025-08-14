import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import type { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: number): User | undefined {
    const user = this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  create(@Body() user: CreateUserDto): User {
    return this.userService.createUser(user);
  }

  @Delete(':id')
  delete(@Param('id') id: number): void {
    this.userService.deleteUser(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: UpdateUserDto): User {
    const updatedUser = this.userService.updateUser(id, user);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
}
