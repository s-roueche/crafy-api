import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  PreconditionFailedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Authentication } from '@nestjs-cognito/auth';

@Controller('user')
@Authentication()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUser({ id });
    if (user) {
      return user;
    }
    throw new PreconditionFailedException('User not found');
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }
}
