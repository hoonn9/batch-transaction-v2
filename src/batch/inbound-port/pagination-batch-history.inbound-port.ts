import { BatchHistoryEntity } from '../entity/batch-history.entity';

export type PaginationBatchHistoryInboundPortInputDto = {
  size: number;
  page: number;
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
};
export type PaginationBatchHistoryInboundPortOutputDto = {
  entities: BatchHistoryEntity[];
  pageInfo: {
    totalPage: number;
  };
};

export interface PaginationBatchHistoryInboundPort {
  execute(
    params: PaginationBatchHistoryInboundPortInputDto,
  ): Promise<PaginationBatchHistoryInboundPortOutputDto>;
}

export const PAGINATION_BATCH_HISTORY_INBOUND_PORT =
  'PAGINATION_BATCH_HISTORY_INBOUND_PORT';
