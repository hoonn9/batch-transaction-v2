import { MergeTransactionEntity } from '../entity/merge-transaction.entity';

export type SaveMergeTxInboundInputDto = {
  mergeTxs: MergeTransactionEntity[];
};

export type SaveMergeTxInboundOutputDto = Promise<void>;

export interface SaveMergeTxInboundPort {
  execute(params: SaveMergeTxInboundInputDto): SaveMergeTxInboundOutputDto;
}

export const SAVE_MERGE_TX_INBOUND_PORT = 'SAVE_MERGE_TX_INBOUND_PORT' as const;
