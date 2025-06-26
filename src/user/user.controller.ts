import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUser({ id });
    if (user) {
      return user;
    }
    throw new Error('User not found');
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id/exists')
  async doesUserExist(@Param('id') id: string): Promise<boolean> {
    return this.userService.doesUserExist({ id });
  }

  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }
}
