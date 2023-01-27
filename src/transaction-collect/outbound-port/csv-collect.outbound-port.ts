import { CollectTransactionDto } from './dto/collect-transaction.dto';

export type CsvCollectOutboundPortInputDto = {
  size: number;
  page: number;
};

export type CsvCollectOutboundPortOutputDto = Promise<
  CollectTransactionDto[] | null
>;

export interface CsvCollectOutboundPort {
  execute(
    params: CsvCollectOutboundPortInputDto,
  ): Promise<CsvCollectOutboundPortOutputDto>;
}

export const CSV_COLLECT_OUTBOUND_PORT = 'CSV_COLLECT_OUTBOUND_PORT' as const;
