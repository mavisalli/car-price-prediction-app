import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
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

  it('can create an instance of auth service', async () => {
    //Create a fake copy of the users service

    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'kitaptek12');

    expect(user.password).not.toEqual('Kitaptek12');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if email is in use', async () => {
    await service.signup('asdf@asdf.com', '12345');
    await expect(
      service.signup('asdf@asdf.com', '12345'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    expect.assertions(1);
    await expect(
      service.signin('asdf@asdf.com', '12345'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', '123456');
    await expect(
      service.signin('test@test.com', 'asdadsfa'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
