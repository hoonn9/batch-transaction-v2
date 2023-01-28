import { MergeTransactionEntity } from '../entity/merge-transaction.entity';

export type PaginationMergeTxOutboundPortInputDto = {
  size: number;
  page: number;
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
};
export type PaginationMergeTxOutboundPortOutputDto = {
  entities: MergeTransactionEntity[];
  pageInfo: {
    totalPage: number;
  };
};

export interface PaginationMergeTxOutboundPort {
  execute(
    params: PaginationMergeTxOutboundPortInputDto,
  ): Promise<PaginationMergeTxOutboundPortOutputDto>;
}

export const PAGINATION_MERGE_TX_OUTBOUND_PORT =
  'PAGINATION_MERGE_TX_OUTBOUND_PORT' as const;
