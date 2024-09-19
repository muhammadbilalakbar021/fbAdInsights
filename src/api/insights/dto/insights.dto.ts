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

export class InsightsDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.toString())
  _id: any;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => value?.toString())
  userId: any;

  @Expose()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsNotEmpty()
  type: string;

  @Expose()
  @IsNotEmpty()
  date: string;

  @Expose()
  @IsNotEmpty()
  category: string;

  @Expose()
  @IsNotEmpty()
  description: string;

  // HELPERS

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  isDeleted: boolean;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  deletedAt: Date;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  isUpdated: boolean;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }

  constructor(partial: Partial<InsightsDto>) {
    Object.assign(this, partial);
  }
}
