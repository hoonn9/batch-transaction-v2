import { MergeTxBatchHistoryEntity } from '../entity/merge-tx-batch-history.entity';

export type FindMergeTxBatchHistoryInboundPortInputDto = {
  id: string;
};

export type FindMergeTxBatchHistoryInboundPortOutputDto = Promise<
  MergeTxBatchHistoryEntity | undefined
>;

export interface FindMergeTxBatchHistoryInboundPort {
  execute(
    params: FindMergeTxBatchHistoryInboundPortInputDto,
  ): Promise<FindMergeTxBatchHistoryInboundPortOutputDto>;
}

export const FIND_MERGE_TX_BATCH_HISTORY_INBOUND_PORT =
  'FIND_MERGE_TX_BATCH_HISTORY_INBOUND_PORT' as const;
