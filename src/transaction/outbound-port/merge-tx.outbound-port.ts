import { MergeTransactionEntity } from '../entity/merge-transaction.entity';
import { TransactionEntity } from '../entity/transaction.entity';
import { StoreTransactionEntity } from '../entity/store-transaction.entity';

export type MergeTxOutboundInputDto = {
  tx: TransactionEntity;
  storeTx: StoreTransactionEntity;
};

export type MergeTxOutboundOutputDto = MergeTransactionEntity;

export interface MergeTxOutboundPort {
  execute(params: MergeTxOutboundInputDto): MergeTxOutboundOutputDto;
}

export const MERGE_TX_OUTBOUND_PORT = 'MERGE_TX_OUTBOUND_PORT' as const;
