import {
  IsIn,
  IsNumber,
  IsNumberString,
  IsString,
  Validate,
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

  @IsString()
  transactionId!: string;
}
