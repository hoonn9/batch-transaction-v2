import { BatchHistoryEntity } from '../entity/batch-history.entity';

export type SaveBatchHistoryInboundPortInputDto = BatchHistoryEntity[];
export type SaveBatchHistoryInboundPortOutputDto = Promise<void>;

export interface SaveBatchHistoryInboundPort {
  execute(
    params: SaveBatchHistoryInboundPortInputDto,
  ): Promise<SaveBatchHistoryInboundPortOutputDto>;
}

export const SAVE_BATCH_HISTORY_INBOUND_PORT =
  'SAVE_BATCH_HISTORY_INBOUND_PORT' as const;
