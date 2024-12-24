import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.validateUserCreation(createUserDto);
    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      roles: createUserDto.roles?.map((role) => new Role(role)),
    });
    return this.usersRepository.create(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credentials not valid!');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto, { roles: true });
  }

  private async validateUserCreation(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('User already exists!');
  }
}
