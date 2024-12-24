import {
  IsArray,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { RoleDto } from './role.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles?: RoleDto[];
}
