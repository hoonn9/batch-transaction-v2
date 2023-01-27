import { TransactionEntity } from '../transaction/entity/transaction.entity';
import { StoreTransactionEntity } from '../transaction/entity/store-transaction.entity';

export type MergeTransactionTarget = {
  tx: TransactionEntity;
  storeTx: StoreTransactionEntity;
};

export type FindStoreTxByTx = (
  tx: TransactionEntity,
) => StoreTransactionEntity | null;
