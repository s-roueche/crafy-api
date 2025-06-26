import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      const user: User = { id: '1' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await userService.getUser({ id: '1' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(user);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.getUser({ id: '2' });
      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = [{ id: '1' }, { id: '2' }];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await userService.getAllUsers();
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toBe(users);
    });

    it('should return an empty array if no users found', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await userService.getAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const userInput: Prisma.UserCreateInput = { id: '3' };

      const createdUser: User = {
        id: '3',
      };

      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userInput);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: userInput,
      });
      expect(result).toBe(createdUser);
    });
  });

  describe('doesUserExist', () => {
    it('should return true if user exists', async () => {
      const user: User = { id: '1' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await userService.doesUserExist({ id: '1' });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(true);
    });

    it('should return false if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.doesUserExist({ id: '2' });
      expect(result).toEqual(false);
    });
  });
});
