/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
  IsDate,
  IsDecimal,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Exclude, Expose, Transform, instanceToPlain } from 'class-transformer';

export class AccountDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.toString())
  _id: any;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  email: string;

  @Exclude({ toPlainOnly: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  password: string;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  isBlacklisted: boolean;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  isActive: boolean;

  @Expose()
  @IsOptional()
  isCreated: boolean;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  isDeleted: boolean;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  isUpdated: boolean;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  deletedAt: Date;

  @Expose()
  @IsOptional()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }

  constructor(partial: Partial<AccountDto>) {
    Object.assign(this, partial);
  }
}
