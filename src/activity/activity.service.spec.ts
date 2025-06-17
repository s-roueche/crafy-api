import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { PrismaService } from '../prisma.service';
import { Activity, Prisma, TimeWorked } from '@prisma/client';

describe('ActivityService', () => {
  let activityService: ActivityService;

  const mockPrismaService = {
    activity: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    activityService = module.get<ActivityService>(ActivityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(activityService).toBeDefined();
  });

  describe('getActivity', () => {
    it('should return an activity if found', async () => {
      const activity: Activity = {
        id: '1',
        date: new Date('2025-06-01'),
        timeWorked: 'FULL_DAY' as TimeWorked,
        reportId: 'report-1',
        comment: 'Did some work',
      };

      mockPrismaService.activity.findUnique.mockResolvedValue(activity);

      const result = await activityService.getActivity({ id: '1' });
      expect(mockPrismaService.activity.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(activity);
    });

    it('should return null if activity not found', async () => {
      mockPrismaService.activity.findUnique.mockResolvedValue(null);

      const result = await activityService.getActivity({ id: '2' });
      expect(result).toBeNull();
    });
  });

  describe('getAllActivities', () => {
    it('should return an array of activities', async () => {
      const activities: Activity[] = [
        {
          id: '1',
          date: new Date('2025-06-01'),
          timeWorked: 'FULL_DAY' as TimeWorked,
          reportId: 'report-1',
          comment: 'Activity 1',
        },
        {
          id: '2',
          date: new Date('2025-06-02'),
          timeWorked: 'HALF_DAY' as TimeWorked,
          reportId: 'report-2',
          comment: 'Activity 2',
        },
      ];

      mockPrismaService.activity.findMany.mockResolvedValue(activities);

      const result = await activityService.getAllActivities();
      expect(mockPrismaService.activity.findMany).toHaveBeenCalled();
      expect(result).toBe(activities);
    });

    it('should return an empty array if no activities found', async () => {
      mockPrismaService.activity.findMany.mockResolvedValue([]);

      const result = await activityService.getAllActivities();
      expect(result).toEqual([]);
    });
  });

  describe('createActivity', () => {
    it('should create and return a new activity', async () => {
      const activityInput: Prisma.ActivityCreateInput = {
        date: new Date('2025-06-03'),
        timeWorked: 'FULL_DAY',
        report: {
          connect: {
            id: 'report-3',
          },
        },
        comment: 'Worked all day',
      };

      const createdActivity: Activity = {
        id: '3',
        date: new Date('2025-06-03'),
        timeWorked: 'FULL_DAY',
        reportId: 'report-3',
        comment: 'Worked all day',
      };

      mockPrismaService.activity.create.mockResolvedValue(createdActivity);

      const result = await activityService.createActivity(activityInput);
      expect(mockPrismaService.activity.create).toHaveBeenCalledWith({
        data: activityInput,
      });
      expect(result).toBe(createdActivity);
    });
  });

  describe('updateActivity', () => {
    it('should update and return the activity', async () => {
      const updateInput: Prisma.ActivityUpdateInput = {
        comment: 'Updated comment',
        timeWorked: 'HALF_DAY',
      };

      const whereInput: Prisma.ActivityWhereUniqueInput = {
        id: '1',
      };

      const updatedActivity: Activity = {
        id: '1',
        date: new Date('2025-06-01'),
        timeWorked: 'HALF_DAY',
        reportId: 'report-1',
        comment: 'Updated comment',
      };

      mockPrismaService.activity.update.mockResolvedValue(updatedActivity);

      const result = await activityService.updateActivity({
        data: updateInput,
        where: whereInput,
      });

      expect(mockPrismaService.activity.update).toHaveBeenCalledWith({
        data: updateInput,
        where: whereInput,
      });

      expect(result).toBe(updatedActivity);
    });
  });
});
