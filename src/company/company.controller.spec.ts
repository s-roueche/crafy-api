import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';

describe('CompanyController', () => {
  let controller: CompanyController;

  const mockCompanyService = {
    getCompany: jest.fn(),
    getAllCompanies: jest.fn(),
    createCompany: jest.fn(),
    updateCompany: jest.fn(),
    deleteCompany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: mockCompanyService }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCompanyById', () => {
    it('should return a company if found', async () => {
      const company: Company = { id: '1', businessName: 'ACME Corp' };
      mockCompanyService.getCompany.mockResolvedValue(company);

      const result = await controller.getCompanyById('1');
      expect(mockCompanyService.getCompany).toHaveBeenCalledWith({ id: '1' });
      expect(result).toBe(company);
    });

    it('should throw an error if company not found', async () => {
      mockCompanyService.getCompany.mockResolvedValue(null);

      await expect(controller.getCompanyById('nonexistent')).rejects.toThrow(
        'Company not found',
      );
    });
  });

  describe('getAllCompanies', () => {
    it('should return an array of companies', async () => {
      const companies: Company[] = [
        { id: '1', businessName: 'ACME Corp' },
        { id: '2', businessName: 'Globex Inc' },
      ];
      mockCompanyService.getAllCompanies.mockResolvedValue(companies);

      const result = await controller.getAllCompanies();
      expect(mockCompanyService.getAllCompanies).toHaveBeenCalled();
      expect(result).toBe(companies);
    });

    it('should return an empty array if no companies exist', async () => {
      mockCompanyService.getAllCompanies.mockResolvedValue([]);

      const result = await controller.getAllCompanies();
      expect(result).toEqual([]);
    });
  });

  describe('createCompany', () => {
    it('should create and return a new company', async () => {
      const input = { businessName: 'Stark Industries' };
      const createdCompany: Company = {
        id: '3',
        businessName: 'Stark Industries',
      };

      mockCompanyService.createCompany.mockResolvedValue(createdCompany);

      const result = await controller.createCompany(input);
      expect(mockCompanyService.createCompany).toHaveBeenCalledWith(input);
      expect(result).toBe(createdCompany);
    });
  });

  describe('updateCompany', () => {
    it('should update and return a company', async () => {
      const id = '1';
      const updateData = { businessName: 'Wayne Enterprises' };
      const updatedCompany: Company = {
        id,
        businessName: 'Wayne Enterprises',
      };

      mockCompanyService.updateCompany.mockResolvedValue(updatedCompany);

      const result = await controller.updateCompany(id, updateData);
      expect(mockCompanyService.updateCompany).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
      expect(result).toBe(updatedCompany);
    });
  });

  describe('deleteCompany', () => {
    it('should delete and return a company', async () => {
      const deletedCompany: Company = {
        id: '1',
        businessName: 'Old Co',
      };

      mockCompanyService.deleteCompany.mockResolvedValue(deletedCompany);

      const result = await controller.deleteCompany('1');
      expect(mockCompanyService.deleteCompany).toHaveBeenCalledWith({
        id: '1',
      });
      expect(result).toBe(deletedCompany);
    });
  });
});
