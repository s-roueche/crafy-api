import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';
import { Authentication, CognitoUser } from '@nestjs-cognito/auth';

@Controller('company')
@Authentication()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(':id')
  async getCompanyById(@Param('id') id: string): Promise<Company> {
    const company = await this.companyService.getCompany({
      id,
    });
    if (company) {
      return company;
    }
    throw new Error('Company not found');
  }

  @Get()
  async getAllCompanies(@CognitoUser('sub') sub: string): Promise<Company[]> {
    return this.companyService.getAllCompaniesByUserId(sub);
  }

  @Post()
  async createCompany(
    @Body()
    data: {
      businessName: string;
      userCreatorId: string;
    },
  ): Promise<Company> {
    const { businessName, userCreatorId } = data;
    return this.companyService.createCompany({
      businessName,
      userCreator: {
        connect: {
          id: userCreatorId,
        },
      },
    });
  }

  @Put(':id')
  async updateCompany(
    @Param('id') id: string,
    @Body()
    data: {
      businessName: string;
      userCreatorId: string;
    },
  ): Promise<Company> {
    return this.companyService.updateCompany({
      data,
      where: { id },
    });
  }

  @Delete(':id')
  async deleteCompany(@Param('id') id: string): Promise<Company> {
    return this.companyService.deleteCompany({ id });
  }
}
