import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Report, Prisma, Activity } from '@prisma/client';

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

  async getActivitiesByReportId(
    reportWhereUniqueInput: Prisma.ReportWhereUniqueInput,
  ): Promise<Activity[]> {
    const report = await this.prisma.report.findUnique({
      where: reportWhereUniqueInput,
      include: { activities: true },
    });

    if (!report) {
      throw new Error(`No report with id ${reportWhereUniqueInput.id}`);
    }

    return report.activities;
  }

  async updateReport(params: {
    where: Prisma.ReportWhereUniqueInput;
    data: Prisma.ReportUpdateInput;
  }): Promise<Report> {
    return this.prisma.report.update(params);
  }
}
