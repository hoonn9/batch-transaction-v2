import { IsInt, IsOptional, Min, Validate } from 'class-validator';
import { YYYYmmDD } from '../lib/validator';
import { Type } from 'class-transformer';

export class PaginationInputDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @Min(5)
  @Type(() => Number)
  size: number;
}

export class DateRangeInputDto {
  @IsOptional()
  @Validate(YYYYmmDD, {
    message: 'date 값은 yyyy-mm-dd 형식이 되어야합니다.',
  })
  startDate?: string;

  @IsOptional()
  @Validate(YYYYmmDD, {
    message: 'date 값은 yyyy-mm-dd 형식이 되어야합니다.',
  })
  endDate?: string;
}
