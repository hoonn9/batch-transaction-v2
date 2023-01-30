import { MergeTxBatchHistoryEntity } from '../entity/merge-tx-batch-history.entity';

export type FindMergeTxBatchHistoryOutboundPortInputDto = {
  id: string;
};

export type FindMergeTxBatchHistoryOutboundPortOutputDto = Promise<
  MergeTxBatchHistoryEntity | undefined
>;

export interface FindMergeTxBatchHistoryOutboundPort {
  execute(
    params: FindMergeTxBatchHistoryOutboundPortInputDto,
  ): Promise<FindMergeTxBatchHistoryOutboundPortOutputDto>;
}

export const FIND_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT =
  'FIND_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT' as const;
