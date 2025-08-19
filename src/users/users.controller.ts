import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import type { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User | undefined> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.createUser(user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userService.updateUser(id, user);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }
}
