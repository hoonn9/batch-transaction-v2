import { MergeTransactionEntity } from '../entity/merge-transaction.entity';

export type MergeTxOutboundInputDto = {
  tx: {
    transactionId: string;
    storeId: string;
    amount: number;
    balance: number;
    cancelYn: 'Y' | 'N';
    date: string;
  };
  storeTx: {
    storeId: string;
    transactionId: string;
    productId: string;
  };
};

export type MergeTxOutboundOutputDto = MergeTransactionEntity;

export interface MergeTxOutboundPort {
  execute(params: MergeTxOutboundInputDto): MergeTxOutboundOutputDto;
}

export const MERGE_TX_OUTBOUND_PORT = 'MERGE_TX_OUTBOUND_PORT' as const;
