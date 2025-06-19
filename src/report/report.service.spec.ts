import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { Report, Prisma, Activity } from '@prisma/client';
import { PrismaService } from '../prisma.service';

describe('ReportService', () => {
  let service: ReportService;

  const mockPrismaService = {
    report: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReport', () => {
    it('should return a report if found', async () => {
      const report: Report = {
        id: '1',
        clientId: '101',
        userId: '1001',
        monthReport: new Date('2025-06-01'),
        comment: 'no comment',
      };
      mockPrismaService.report.findUnique.mockResolvedValue(report);

      const result = await service.getReport({
        id: '1',
      });
      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(report);
    });

    it('should return null if report not found', async () => {
      mockPrismaService.report.findUnique.mockResolvedValue(null);

      const result = await service.getReport({ id: '1' });
      expect(result).toBeNull();
    });
  });

  describe('getAllReports', () => {
    it('should return a list of reports', async () => {
      const reports: Report[] = [
        {
          id: '1',
          clientId: '101',
          userId: '1001',
          monthReport: new Date('2025-06-01'),
          comment: 'no comment',
        },
        {
          id: '2',
          clientId: '102',
          userId: '1002',
          monthReport: new Date('2025-07-01'),
          comment: 'comment',
        },
      ];
      mockPrismaService.report.findMany.mockResolvedValue(reports);

      const result = await service.getAllReports();
      expect(mockPrismaService.report.findMany).toHaveBeenCalled();
      expect(result).toBe(reports);
    });

    it('should return an empty list if no reports found', async () => {
      mockPrismaService.report.findMany.mockResolvedValue([]);

      const result = await service.getAllReports();
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
        comment: 'no comment',
      };
      const userInput: Prisma.ReportCreateInput = {
        id: '1',
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
        monthReport: new Date('2025-06-01'),
        comment: 'no comment',
      };
      mockPrismaService.report.create.mockResolvedValue(createdReport);

      const result = await service.createReport(userInput);
      expect(mockPrismaService.report.create).toHaveBeenCalledWith({
        data: userInput,
      });
      expect(result).toBe(createdReport);
    });
  });

  describe('getActivitiesByReportId', () => {
    it('should return a list of activities', async () => {
      const mockActivities: Activity[] = [
        {
          id: 'activity-1',
          date: new Date('2025-06-01'),
          timeWorked: 'FULL_DAY',
          reportId: 'report-1',
          comment: 'Worked on frontend',
        },
      ];

      mockPrismaService.report.findUnique.mockResolvedValue({
        id: 'report-1',
        activities: mockActivities,
      });

      const result = await service.getActivitiesByReportId({
        id: 'report-1',
      });
      expect(result).toEqual(mockActivities);
      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({
        where: { id: 'report-1' },
        include: { activities: true },
      });
    });

    it('should return an empty list if there are no activities', async () => {
      mockPrismaService.report.findUnique.mockResolvedValue({
        id: 'report-1',
        activities: [],
      });

      const result = await service.getActivitiesByReportId({ id: 'report-1' });
      expect(result).toEqual([]);
      expect(mockPrismaService.report.findUnique).toHaveBeenCalled();
    });

    it('should throw an error if report does not exist', async () => {
      mockPrismaService.report.findUnique.mockResolvedValue(null);

      await expect(
        service.getActivitiesByReportId({ id: 'non-existent-id' }),
      ).rejects.toThrow('No report with id non-existent-id');

      expect(mockPrismaService.report.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
        include: { activities: true },
      });
    });
  });

  describe('updateReport', () => {
    it('should update and return the report', async () => {
      const updateInput: Prisma.ReportUpdateInput = {
        comment: 'Updated comment',
      };

      const whereInput: Prisma.ReportWhereUniqueInput = {
        id: '1',
      };

      const updatedReport: Report = {
        id: '1',
        clientId: '11',
        monthReport: new Date('01/06/2025'),
        comment: 'Updated comment',
        userId: '1001',
      };

      mockPrismaService.report.update.mockResolvedValue(updatedReport);

      const result = await service.updateReport({
        data: updateInput,
        where: whereInput,
      });

      expect(mockPrismaService.report.update).toHaveBeenCalledWith({
        data: updateInput,
        where: whereInput,
      });

      expect(result).toBe(updatedReport);
    });
  });
});
