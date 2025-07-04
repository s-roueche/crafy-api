import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { ReportService } from './report.service';
import { Activity, Report } from '@prisma/client';
import { Authentication, CognitoUser } from '@nestjs-cognito/auth';

@Controller('report')
@Authentication()
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
  async getAllReports(@CognitoUser('sub') sub: string): Promise<Report[]> {
    return this.reportService.getAllReportsByUser(sub);
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

  @Get(':id/activities')
  async getActivities(@Param('id') id: string): Promise<Activity[]> {
    return this.reportService.getActivitiesByReportId({ id });
  }

  @Get(':id/totalTime')
  async getTotalTime(@Param('id') id: string): Promise<number> {
    const activities = await this.reportService.getActivitiesByReportId({ id });
    let sum = 0;
    for (const activity of activities) {
      if (activity.timeWorked === 'FULL_DAY') {
        sum++;
      } else {
        sum += 0.5;
      }
    }
    return sum;
  }

  @Put('comment/:id')
  async updateComment(
    @Param('id') id: string,
    @Body() data: { comment: string },
  ): Promise<Report> {
    const { comment } = data;
    return this.reportService.updateReport({
      where: { id },
      data: { comment },
    });
  }
}
