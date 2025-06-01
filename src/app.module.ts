import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { PostsService } from './post.service';
import { UsersService } from './user.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [CatsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, UsersService, PrismaService, PostsService],
})
export class AppModule {}
