import { TransactionRaw } from '../../../../../transaction/outbound-adapter/type/tx-repository.type';

export type MergeTxBatchHistoryRaw = {
  id: string;
  batchHistoryId: string;
  failedTxs: TransactionRaw[];
};
