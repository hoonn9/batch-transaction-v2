import { MergeTransactionEntity } from '../entity/merge-transaction.entity';

export type PaginationMergeTxInboundPortInputDto = {
  size: number;
  page: number;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
};
export type PaginationMergeTxInboundPortOutputDto = {
  entities: MergeTransactionEntity[];
  pageInfo: {
    totalPage: number;
  };
};

export interface PaginationMergeTxInboundPort {
  execute(
    params: PaginationMergeTxInboundPortInputDto,
  ): Promise<PaginationMergeTxInboundPortOutputDto>;
}

export const PAGINATION_MERGE_TX_INBOUND_PORT =
  'PAGINATION_MERGE_TX_INBOUND_PORT' as const;
