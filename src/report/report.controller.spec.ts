import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Report, Prisma } from '@prisma/client';

describe('ReportController', () => {
  let controller: ReportController;

  const mockReportService = {
    getReport: jest.fn(),
    getAllReports: jest.fn(),
    createReport: jest.fn(),
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
});
