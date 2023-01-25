import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { YYYYmmDD } from '../../../lib/validator';

export class CollectTransactionDto {
  @IsNumber()
  amount!: number;

  @IsNumber()
  balance!: number;

  @IsIn(['Y', 'N'])
  cancelYn!: 'Y' | 'N';

  @Validate(YYYYmmDD)
  date!: string; // yyyy-MM-dd

  @IsNumberString()
  storeId!: string;

  @IsUUID()
  transactionId!: string;
}

export class CollectTransactionPageInfoDto {
  @IsNumber()
  totalPage!: number;
}

export class CollectTransactionResponseDto {
  @ValidateNested({ each: true })
  @Type(() => CollectTransactionDto)
  list: CollectTransactionDto[];

  @ValidateNested()
  @Type(() => CollectTransactionPageInfoDto)
  pageInfo: CollectTransactionPageInfoDto;
}
