import { TransactionEntity } from '../../../../transaction/entity/transaction.entity';

export class MergeTxBatchHistoryEntity {
  id: string;
  batchHistoryId: string;
  failedTxs: TransactionEntity[];
}
