import { MergeTxBatchHistoryEntity } from '../entity/merge-tx-batch-history.entity';

export type SaveMergeTxBatchHistoryInboundPortInputDto =
  MergeTxBatchHistoryEntity[];
export type SaveMergeTxBatchHistoryInboundPortOutputDto = Promise<void>;

export interface SaveMergeTxBatchHistoryInboundPort {
  execute(
    params: SaveMergeTxBatchHistoryInboundPortInputDto,
  ): Promise<SaveMergeTxBatchHistoryInboundPortOutputDto>;
}

export const SAVE_MERGE_TX_BATCH_HISTORY_INBOUND_PORT =
  'SAVE_MERGE_TX_BATCH_HISTORY_INBOUND_PORT' as const;
