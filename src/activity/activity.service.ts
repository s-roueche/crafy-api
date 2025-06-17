import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Activity, Prisma } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivity(
    activityWhereUniqueInput: Prisma.ActivityWhereUniqueInput,
  ): Promise<Activity | null> {
    return this.prisma.activity.findUnique({
      where: activityWhereUniqueInput,
    });
  }

  async getAllActivities(): Promise<Activity[]> {
    return this.prisma.activity.findMany();
  }

  async createActivity(data: Prisma.ActivityCreateInput): Promise<Activity> {
    return this.prisma.activity.create({
      data,
    });
  }

  async updateActivity(params: {
    data: Prisma.ActivityUpdateInput;
    where: Prisma.ActivityWhereUniqueInput;
  }): Promise<Activity> {
    const { data, where } = params;
    return this.prisma.activity.update({
      data,
      where,
    });
  }
}
