export type MergeTxInboundInputDto = {
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

export type MergeTxInboundOutputDto = {
  transactionId: string;
  productId: string;
  storeId: string;
  amount: number;
  balance: number;
  cancelYn: 'Y' | 'N';
  date: string;
};

export interface MergeTxInboundPort {
  execute(params: MergeTxInboundInputDto): MergeTxInboundOutputDto;
}

export const MERGE_TX_INBOUND_PORT = 'MERGE_TX_INBOUND_PORT' as const;
