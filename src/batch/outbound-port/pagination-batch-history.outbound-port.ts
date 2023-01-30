import { BatchHistoryEntity } from '../entity/batch-history.entity';

export type PaginationBatchHistoryOutboundPortInputDto = {
  size: number;
  page: number;
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
};
export type PaginationBatchHistoryOutboundPortOutputDto = {
  entities: BatchHistoryEntity[];
  pageInfo: {
    totalPage: number;
  };
};

export interface PaginationBatchHistoryOutboundPort {
  execute(
    params: PaginationBatchHistoryOutboundPortInputDto,
  ): Promise<PaginationBatchHistoryOutboundPortOutputDto>;
}

export const PAGINATION_BATCH_HISTORY_OUTBOUND_PORT =
  'PAGINATION_BATCH_HISTORY_OUTBOUND_PORT';
