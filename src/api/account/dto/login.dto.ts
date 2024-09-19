import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  username: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @MinLength(5)
  @MaxLength(40)
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  password: string;
}
