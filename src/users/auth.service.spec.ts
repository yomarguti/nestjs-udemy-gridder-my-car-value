import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  let users: User[] = [];

  beforeEach(async () => {
    // Create a fake copy of the users service
    fakeUsersService = {
      find: (email: string) => {
        const filteresUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteresUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    users = [];
  });

  it('should create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with a salted and hashed password', async () => {
    const user = await service.signup('yo@yo.com', 'frdfr');
    expect(user.password).not.toEqual('frdfr');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('y@y.com', '123456');
    await expect(service.signup('y@y.com', '123456')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throws an error if signin is called with an unused email', async () => {
    await expect(service.signin('yi@y.com', '1234567')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throws an error if a password invalid is provided', async () => {
    await service.signup('andres@y.com', '123456');
    await expect(service.signin('andres@y.com', '1234567')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should returns a user if a correct password is provided', async () => {
    await service.signup('yu@y.com', '123456');
    const user = await service.signin('yu@y.com', '123456');
    expect(user).toBeDefined();
  });
});
