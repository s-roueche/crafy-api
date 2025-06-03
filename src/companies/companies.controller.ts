import { Controller, Get, Param } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from '@prisma/client';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':name')
  async getCompanyById(@Param('name') name: string): Promise<Company> {
    const company = await this.companiesService.getCompany({
      businessName: name,
    });
    if (company) {
      return company;
    }
    throw new Error('Company not found');
  }
}
