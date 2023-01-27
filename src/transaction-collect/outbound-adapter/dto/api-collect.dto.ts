import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { CollectTransactionDto } from '../../outbound-port/dto/collect-transaction.dto';

export class ApiCollectTransactionPageInfoDto {
  @IsNumber()
  totalPage!: number;
}

export class ApiCollectTransactionResponseDto {
  @ValidateNested({ each: true })
  @Type(() => CollectTransactionDto)
  list: CollectTransactionDto[];

  @ValidateNested()
  @Type(() => ApiCollectTransactionPageInfoDto)
  pageInfo: ApiCollectTransactionPageInfoDto;
}
