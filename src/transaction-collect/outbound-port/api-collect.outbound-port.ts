import { CollectTransactionDto } from './dto/collect-transaction.dto';

export type ApiCollectOutboundPortInputDto = {
  size: number;
  page: number;
};
export type ApiCollectOutboundPortOutputDto = {
  transactions: CollectTransactionDto[];
  failedPages: number[];
} | null;

export interface ApiCollectOutboundPort {
  execute(
    params: ApiCollectOutboundPortInputDto,
  ): Promise<ApiCollectOutboundPortOutputDto>;
}

export const API_COLLECT_OUTBOUND_PORT = 'API_COLLECT_OUTBOUND_PORT' as const;
