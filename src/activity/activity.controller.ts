import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity, TimeWorked } from '@prisma/client';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get(':id')
  async getActivityById(@Param('id') id: string): Promise<Activity> {
    const activity = await this.activityService.getActivity({ id });
    if (activity) {
      return activity;
    }
    throw new Error('Activity not found');
  }

  @Get()
  async getAllActivities(): Promise<Activity[]> {
    return this.activityService.getAllActivities();
  }

  @Post()
  async createActivity(
    @Body()
    data: {
      date: Date;
      comment: string;
      timeWorked: TimeWorked;
      reportId: string;
    },
  ): Promise<Activity> {
    const { date, comment, timeWorked, reportId } = data;
    return this.activityService.createActivity({
      comment,
      timeWorked,
      report: {
        connect: {
          id: reportId,
        },
      },
      date,
    });
  }
}
