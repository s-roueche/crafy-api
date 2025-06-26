import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getUser: jest.fn(),
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    doesUserExist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const user: User = { id: '1' };
      mockUserService.getUser.mockResolvedValue(user);

      const result = await controller.getUserById(user.id);
      expect(mockUserService.getUser).toHaveBeenCalledWith(user);
      expect(result).toBe(user);
    });

    it('should throw an error if user not found', async () => {
      mockUserService.getUser.mockResolvedValue(null);

      await expect(controller.getUserById('1')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users if there are any', async () => {
      const users: User[] = [{ id: '1' }, { id: '2' }, { id: '3' }];
      mockUserService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(result).toBe(users);
    });

    it('should return an empty array of there are no users', async () => {
      mockUserService.getAllUsers.mockResolvedValue([]);

      const result = await controller.getAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createdUser: User = { id: '1' };
      const userInput: Prisma.UserCreateInput = { id: '1' };
      mockUserService.createUser.mockResolvedValue(createdUser);

      const result = await controller.createUser(userInput);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userInput);
      expect(result).toBe(createdUser);
    });
  });

  describe('doesUserExist', () => {
    it('should return true if user exists', async () => {
      mockUserService.doesUserExist.mockResolvedValue(true);

      const result = await controller.doesUserExist('1');
      expect(mockUserService.doesUserExist).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(true);
    });

    it("should return false if user doesn't exist", async () => {
      mockUserService.doesUserExist.mockResolvedValue(false);

      const result = await controller.doesUserExist('1');
      expect(result).toEqual(false);
    });
  });
});
