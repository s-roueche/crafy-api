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

@Controller('company')
export class CompanyController {
  constructor(private readonly companiesService: CompanyService) {}

  @Get(':id')
  async getCompanyById(@Param('id') id: string): Promise<Company> {
    const company = await this.companiesService.getCompany({
      id,
    });
    if (company) {
      return company;
    }
    throw new Error('Company not found');
  }

  @Get()
  async getAllCompanies(): Promise<Company[]> {
    return this.companiesService.getAllCompanies();
  }

  @Post()
  async createCompany(
    @Body() data: { businessName: string },
  ): Promise<Company> {
    return this.companiesService.createCompany(data);
  }

  @Put(':id')
  async updateCompany(
    @Param('id') id: string,
    @Body()
    data: {
      businessName: string;
    },
  ): Promise<Company> {
    return this.companiesService.updateCompany({
      data,
      where: { id },
    });
  }

  @Delete(':id')
  async deleteCompany(@Param('id') id: string): Promise<Company> {
    return this.companiesService.deleteCompany({ id });
  }
}
