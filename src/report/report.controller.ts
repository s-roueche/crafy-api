import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from '@prisma/client';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':id')
  async getReportById(@Param('id') id: string): Promise<Report> {
    const report = await this.reportService.getReport({ id });
    if (report) {
      return report;
    }
    throw new Error('Report not found');
  }

  @Get()
  async getAllReports(): Promise<Report[]> {
    return this.reportService.getAllReports();
  }

  @Post()
  async createReport(
    @Body()
    data: {
      clientId: string;
      userId: string;
      monthReport: Date;
      comment: string;
    },
  ): Promise<Report> {
    const { clientId, userId, monthReport, comment } = data;
    return this.reportService.createReport({
      comment,
      monthReport,
      client: {
        connect: {
          id: clientId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    });
  }
}
