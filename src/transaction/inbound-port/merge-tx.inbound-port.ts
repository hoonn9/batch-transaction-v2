import { TransactionEntity } from '../entity/transaction.entity';
import { StoreTransactionEntity } from '../entity/store-transaction.entity';
import { MergeTransactionEntity } from '../entity/merge-transaction.entity';

export type MergeTxInboundInputDto = {
  tx: TransactionEntity;
  storeTx: StoreTransactionEntity;
};

export type MergeTxInboundOutputDto = MergeTransactionEntity;

export interface MergeTxInboundPort {
  execute(params: MergeTxInboundInputDto): MergeTxInboundOutputDto;
}

export const MERGE_TX_INBOUND_PORT = 'MERGE_TX_INBOUND_PORT' as const;
