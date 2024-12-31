import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.validateUserCreation(createUserDto);
    return this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        roles: createUserDto.roles,
      },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credentials not valid!');
    }

    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id: +getUserDto.id },
    });
  }

  private async validateUserCreation(createUserDto: CreateUserDto) {
    try {
      await this.prismaService.user.findFirstOrThrow({
        where: { email: createUserDto.email },
      });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('User already exists!');
  }
}
