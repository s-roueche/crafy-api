import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity, TimeWorked } from '@prisma/client';

describe('ActivityController', () => {
  let controller: ActivityController;

  const mockActivityService = {
    getActivity: jest.fn(),
    getAllActivities: jest.fn(),
    createActivity: jest.fn(),
    updateActivity: jest.fn(),
    deleteActivity: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [{ provide: ActivityService, useValue: mockActivityService }],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getActivityById', () => {
    it('should return an activity if found', async () => {
      const activity: Activity = {
        id: '1',
        date: new Date('2025-06-01'),
        timeWorked: 'FULL_DAY',
        reportId: 'report-1',
        comment: 'Worked on feature X',
      };

      mockActivityService.getActivity.mockResolvedValue(activity);

      const result = await controller.getActivityById('1');
      expect(mockActivityService.getActivity).toHaveBeenCalledWith({ id: '1' });
      expect(result).toBe(activity);
    });

    it('should throw an error if activity not found', async () => {
      mockActivityService.getActivity.mockResolvedValue(null);

      await expect(controller.getActivityById('999')).rejects.toThrow(
        'Activity not found',
      );
    });
  });

  describe('getAllActivities', () => {
    it('should return an array of activities if there are any', async () => {
      const activities: Activity[] = [
        {
          id: '1',
          date: new Date('2025-06-01'),
          timeWorked: 'FULL_DAY',
          reportId: 'r1',
          comment: 'Activity 1',
        },
        {
          id: '2',
          date: new Date('2025-06-02'),
          timeWorked: 'HALF_DAY',
          reportId: 'r2',
          comment: 'Activity 2',
        },
      ];

      mockActivityService.getAllActivities.mockResolvedValue(activities);

      const result = await controller.getAllActivities();
      expect(mockActivityService.getAllActivities).toHaveBeenCalled();
      expect(result).toBe(activities);
    });

    it('should return an empty array if there are no activities', async () => {
      mockActivityService.getAllActivities.mockResolvedValue([]);

      const result = await controller.getAllActivities();
      expect(result).toEqual([]);
    });
  });

  describe('createActivity', () => {
    it('should create and return a new activity', async () => {
      const activityInput = {
        date: new Date('2025-06-03'),
        comment: 'Created test cases',
        timeWorked: 'FULL_DAY' as TimeWorked,
        reportId: 'report-3',
      };

      const createdActivity: Activity = {
        id: '3',
        date: activityInput.date,
        comment: activityInput.comment,
        timeWorked: activityInput.timeWorked,
        reportId: activityInput.reportId,
      };

      mockActivityService.createActivity.mockResolvedValue(createdActivity);

      const result = await controller.createActivity(activityInput);
      expect(mockActivityService.createActivity).toHaveBeenCalledWith({
        date: activityInput.date,
        comment: activityInput.comment,
        timeWorked: activityInput.timeWorked,
        report: {
          connect: {
            id: activityInput.reportId,
          },
        },
      });
      expect(result).toBe(createdActivity);
    });
  });

  describe('updateActivityTimeWorked', () => {
    it('should update the timeWorked and return the activity', async () => {
      const id = '1';
      const updateData = {
        timeWorked: 'FULL_DAY' as TimeWorked,
      };
      const updatedActivity: Activity = {
        id,
        date: new Date('2025-06-03'),
        comment: 'Created test cases',
        timeWorked: 'FULL_DAY' as TimeWorked,
        reportId: 'report-3',
      };

      mockActivityService.updateActivity.mockResolvedValue(updatedActivity);

      const result = await controller.updateActivityTimeWorked(id, updateData);
      expect(mockActivityService.updateActivity).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
      expect(result).toBe(updatedActivity);
    });
  });

  describe('updateActivityComment', () => {
    it('should update the comment and return the activity', async () => {
      const id = '1';
      const updateData = {
        comment: 'Updated test cases',
      };
      const updatedActivity: Activity = {
        id,
        date: new Date('2025-06-03'),
        comment: 'Updated test cases',
        timeWorked: 'FULL_DAY' as TimeWorked,
        reportId: 'report-3',
      };

      mockActivityService.updateActivity.mockResolvedValue(updatedActivity);

      const result = await controller.updateActivityComment(id, updateData);
      expect(mockActivityService.updateActivity).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
      expect(result).toBe(updatedActivity);
    });
  });

  describe('deleteActivity', () => {
    it('should delete and return the activity', async () => {
      const deletedActivity: Activity = {
        id: '3',
        date: new Date('2025-06-03'),
        timeWorked: 'FULL_DAY',
        reportId: 'report-3',
        comment: 'Worked all day',
      };

      mockActivityService.deleteActivity.mockResolvedValue(deletedActivity);

      const result = await controller.deleteActivity('3');
      expect(mockActivityService.deleteActivity).toHaveBeenCalledWith('3');
      expect(result).toBe(deletedActivity);
    });
  });
});
