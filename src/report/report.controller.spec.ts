import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Report, Prisma, Activity } from '@prisma/client';

describe('ReportController', () => {
  let controller: ReportController;

  const mockReportService = {
    getReport: jest.fn(),
    getAllReports: jest.fn(),
    createReport: jest.fn(),
    getActivitiesByReportId: jest.fn(),
    updateReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [{ provide: ReportService, useValue: mockReportService }],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getReportById', () => {
    it('should return a report if found', async () => {
      const report: Report = {
        id: '1',
        clientId: '101',
        userId: '1001',
        monthReport: new Date('2025-06-01'),
        comment: 'Test report',
      };

      mockReportService.getReport.mockResolvedValue(report);

      const result = await controller.getReportById(report.id);
      expect(mockReportService.getReport).toHaveBeenCalledWith({
        id: report.id,
      });
      expect(result).toBe(report);
    });

    it('should throw an error if report not found', async () => {
      mockReportService.getReport.mockResolvedValue(null);

      await expect(controller.getReportById('nonexistent-id')).rejects.toThrow(
        'Report not found',
      );
    });
  });

  describe('getAllReports', () => {
    it('should return an array of reports if any', async () => {
      const reports: Report[] = [
        {
          id: '1',
          clientId: '101',
          userId: '1001',
          monthReport: new Date('2025-06-01'),
          comment: 'Report 1',
        },
        {
          id: '2',
          clientId: '102',
          userId: '1002',
          monthReport: new Date('2025-06-01'),
          comment: 'Report 2',
        },
      ];
      mockReportService.getAllReports.mockResolvedValue(reports);

      const result = await controller.getAllReports();
      expect(mockReportService.getAllReports).toHaveBeenCalled();
      expect(result).toBe(reports);
    });

    it('should return an empty array if there are no reports', async () => {
      mockReportService.getAllReports.mockResolvedValue([]);

      const result = await controller.getAllReports();
      expect(result).toEqual([]);
    });
  });

  describe('createReport', () => {
    it('should create and return a new report', async () => {
      const createdReport: Report = {
        id: '1',
        clientId: '101',
        userId: '1001',
        monthReport: new Date('2025-06-01'),
        comment: 'Finalized report',
      };

      const requestData = {
        clientId: '101',
        userId: '1001',
        monthReport: new Date('2025-06-01'),
        comment: 'Finalized report',
      };

      const expectedServiceInput: Prisma.ReportCreateInput = {
        comment: 'Finalized report',
        monthReport: new Date('2025-06-01'),
        client: {
          connect: {
            id: '101',
          },
        },
        user: {
          connect: {
            id: '1001',
          },
        },
      };

      mockReportService.createReport.mockResolvedValue(createdReport);

      const result = await controller.createReport(requestData);
      expect(mockReportService.createReport).toHaveBeenCalledWith(
        expectedServiceInput,
      );
      expect(result).toBe(createdReport);
    });
  });

  describe('activities', () => {
    it('should return a list of activities', async () => {
      const mockActivities: Activity[] = [
        {
          id: 'a1',
          date: new Date('2025-06-01'),
          timeWorked: 'FULL_DAY',
          reportId: 'r1',
          comment: 'Did frontend tasks',
        },
      ];

      mockReportService.getActivitiesByReportId.mockResolvedValue(
        mockActivities,
      );

      const result = await controller.getActivities('r1');
      expect(result).toEqual(mockActivities);
      expect(mockReportService.getActivitiesByReportId).toHaveBeenCalledWith({
        id: 'r1',
      });
    });

    it('should return an empty list if there are no activities', async () => {
      mockReportService.getActivitiesByReportId.mockResolvedValue([]);

      const result = await controller.getActivities('r1');
      expect(result).toEqual([]);
    });

    it('should throw an error if report not found', async () => {
      mockReportService.getActivitiesByReportId.mockRejectedValue(
        new Error('No report with id r1'),
      );

      await expect(controller.getActivities('r1')).rejects.toThrow(
        'No report with id r1',
      );
    });
  });

  describe('totalTime', () => {
    it('should return a positive number', async () => {
      const mockActivities: Activity[] = [
        {
          id: '1',
          date: new Date(),
          timeWorked: 'FULL_DAY',
          reportId: 'r1',
          comment: null,
        },
        {
          id: '2',
          date: new Date(),
          timeWorked: 'HALF_DAY',
          reportId: 'r1',
          comment: null,
        },
      ];

      mockReportService.getActivitiesByReportId.mockResolvedValue(
        mockActivities,
      );

      const result = await controller.getTotalTime('r1');
      expect(result).toBe(1.5);
    });

    it('should return 0 if there are no activities', async () => {
      mockReportService.getActivitiesByReportId.mockResolvedValue([]);

      const result = await controller.getTotalTime('r1');
      expect(result).toBe(0);
    });
  });

  describe('updateComment', () => {
    it('should update the comment and return the activity', async () => {
      const id = '1';
      const updateData = {
        comment: 'Updated comment',
      };
      const updatedReport: Report = {
        id: '1',
        clientId: '11',
        monthReport: new Date('01/06/2025'),
        comment: 'Updated comment',
        userId: '1001',
      };

      mockReportService.updateReport.mockResolvedValue(updatedReport);

      const result = await controller.updateComment(id, updateData);
      expect(mockReportService.updateReport).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
      expect(result).toBe(updatedReport);
    });
  });
});
