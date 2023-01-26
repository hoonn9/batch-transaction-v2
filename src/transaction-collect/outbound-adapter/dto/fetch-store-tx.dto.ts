import {
  IsNumber,
  IsNumberString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FetchStoreTxDto {
  @IsNumberString()
  storeId: string;

  @IsUUID()
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
