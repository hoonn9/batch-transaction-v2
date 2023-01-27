import {
  IsNumber,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FetchStoreTxDto {
  @IsNumberString()
  storeId: string;

  @IsString()
  transactionId: string;

  @IsNumberString()
  productId: string;
}

export class FetchStoreTxPageInfoDto {
  @IsNumber()
  totalPage: number;
}

export class FetchStoreTxResponseDto {
  @ValidateNested({ each: true })
  @Type(() => FetchStoreTxDto)
  list: FetchStoreTxDto[];

  @ValidateNested()
  @Type(() => FetchStoreTxPageInfoDto)
  pageInfo: FetchStoreTxPageInfoDto;
}
