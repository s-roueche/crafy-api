import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '../prisma.service';
import { Prisma, Company } from '@prisma/client';

describe('CompanyService', () => {
  let companyService: CompanyService;

  const mockPrismaService = {
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    companyService = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(companyService).toBeDefined();
  });

  describe('getCompany', () => {
    it('should return a company if found', async () => {
      const company: Company = {
        id: '1',
        businessName: 'ACME Corp',
        userCreatorId: '1',
      };
      mockPrismaService.company.findUnique.mockResolvedValue(company);

      const result = await companyService.getCompany({ id: '1' });
      expect(mockPrismaService.company.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(company);
    });

    it('should return null if company not found', async () => {
      mockPrismaService.company.findUnique.mockResolvedValue(null);

      const result = await companyService.getCompany({ id: '2' });
      expect(result).toBeNull();
    });
  });

  describe('getAllCompanies', () => {
    it('should return an array of companies', async () => {
      const companies: Company[] = [
        { id: '1', businessName: 'ACME Corp', userCreatorId: '1' },
        { id: '2', businessName: 'Globex Inc', userCreatorId: '2' },
      ];
      mockPrismaService.company.findMany.mockResolvedValue(companies);

      const result = await companyService.getAllCompanies();
      expect(mockPrismaService.company.findMany).toHaveBeenCalled();
      expect(result).toBe(companies);
    });

    it('should return an empty array if no companies found', async () => {
      mockPrismaService.company.findMany.mockResolvedValue([]);

      const result = await companyService.getAllCompanies();
      expect(result).toEqual([]);
    });
  });

  describe('createCompany', () => {
    it('should create and return a new company', async () => {
      const companyInput: Prisma.CompanyCreateInput = {
        businessName: 'Wayne Enterprises',
        reports: {
          connect: [],
        },
        userCreator: {
          connect: {
            id: '1',
          },
        },
      };

      const createdCompany: Company = {
        id: '3',
        businessName: 'Wayne Enterprises',
        userCreatorId: '1',
      };

      mockPrismaService.company.create.mockResolvedValue(createdCompany);

      const result = await companyService.createCompany(companyInput);
      expect(mockPrismaService.company.create).toHaveBeenCalledWith({
        data: companyInput,
      });
      expect(result).toBe(createdCompany);
    });
  });

  describe('updateCompany', () => {
    it('should update and return the company', async () => {
      const updateInput: Prisma.CompanyUpdateInput = {
        businessName: 'New Name Inc',
      };
      const whereInput: Prisma.CompanyWhereUniqueInput = { id: '1' };

      const updatedCompany: Company = {
        id: '1',
        businessName: 'New Name Inc',
        userCreatorId: '1',
      };

      mockPrismaService.company.update.mockResolvedValue(updatedCompany);

      const result = await companyService.updateCompany({
        data: updateInput,
        where: whereInput,
      });

      expect(mockPrismaService.company.update).toHaveBeenCalledWith({
        data: updateInput,
        where: whereInput,
      });
      expect(result).toBe(updatedCompany);
    });
  });

  describe('deleteCompany', () => {
    it('should delete and return the company', async () => {
      const companyToDelete: Company = {
        id: '1',
        businessName: 'Old Corp',
        userCreatorId: '1',
      };

      mockPrismaService.company.delete.mockResolvedValue(companyToDelete);

      const result = await companyService.deleteCompany({ id: '1' });

      expect(mockPrismaService.company.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(companyToDelete);
    });
  });
});
