import { BatchHistoryEntity } from '../entity/batch-history.entity';

export type SaveBatchHistoryOutboundPortInputDto = BatchHistoryEntity[];
export type SaveBatchHistoryOutboundPortOutputDto = Promise<void>;

export interface SaveBatchHistoryOutboundPort {
  execute(
    params: SaveBatchHistoryOutboundPortInputDto,
  ): Promise<SaveBatchHistoryOutboundPortOutputDto>;
}

export const SAVE_BATCH_HISTORY_OUTBOUND_PORT =
  'SAVE_BATCH_HISTORY_OUTBOUND_PORT' as const;
