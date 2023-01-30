import { MergeTxBatchHistoryEntity } from '../entity/merge-tx-batch-history.entity';

export type SaveMergeTxBatchHistoryOutboundPortInputDto =
  MergeTxBatchHistoryEntity[];
export type SaveMergeTxBatchHistoryOutboundPortOutputDto = Promise<void>;

export interface SaveMergeTxBatchHistoryOutboundPort {
  execute(
    params: SaveMergeTxBatchHistoryOutboundPortInputDto,
  ): Promise<SaveMergeTxBatchHistoryOutboundPortOutputDto>;
}

export const SAVE_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT =
  'SAVE_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT' as const;
