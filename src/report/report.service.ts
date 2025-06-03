import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Report, Prisma } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async getReport(
    reportWhereUniqueInput: Prisma.ReportWhereUniqueInput,
  ): Promise<Report | null> {
    return this.prisma.report.findUnique({
      where: reportWhereUniqueInput,
    });
  }

  async getAllReports(): Promise<Report[]> {
    return this.prisma.report.findMany();
  }

  async createReport(data: Prisma.ReportCreateInput): Promise<Report> {
    return this.prisma.report.create({
      data,
    });
  }
}
