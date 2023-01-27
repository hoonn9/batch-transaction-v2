import { StoreTransactionEntity } from '../../transaction/entity/store-transaction.entity';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';

export type CollectStoreTxInboundPortInputDto = {
  txs: TransactionEntity[];
};
export type CollectStoreTxInboundPortOutputDto = {
  [storeId: string]: {
    [transactionId: string]: StoreTransactionEntity;
  };
};

export interface CollectStoreTxInboundPort {
  execute(
    params: CollectStoreTxInboundPortInputDto,
  ): Promise<CollectStoreTxInboundPortOutputDto>;
}

export const COLLECT_STORE_TX_INBOUND_PORT =
  'COLLECT_STORE_TX_INBOUND_PORT' as const;
