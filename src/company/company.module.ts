import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma.service';
import getCognitoAuthModule from '../getCognitoAuthModule';

@Module({
  imports: [getCognitoAuthModule()],
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
})
export class CompanyModule {}
