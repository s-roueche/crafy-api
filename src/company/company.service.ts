import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Company } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getCompany(
    companyWhereUniqueInput: Prisma.CompanyWhereUniqueInput,
  ): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: companyWhereUniqueInput,
    });
  }

  async createCompany(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({
      data,
    });
  }

  async updateCompany(params: {
    data: Prisma.CompanyUpdateInput;
    where: Prisma.CompanyWhereUniqueInput;
  }): Promise<Company> {
    const { data, where } = params;
    return this.prisma.company.update({
      data,
      where,
    });
  }

  async deleteCompany(where: Prisma.CompanyWhereUniqueInput): Promise<Company> {
    return this.prisma.company.delete({
      where,
    });
  }

  async getAllCompaniesByUserId(userId: string): Promise<Company[]> {
    return this.prisma.company.findMany({ where: { userCreatorId: userId } });
  }
}
