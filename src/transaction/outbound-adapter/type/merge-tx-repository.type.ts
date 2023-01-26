export type MergeTransactionRaw = {
  transactionId: string;
  productId: string;
  storeId: string;
  amount: number;
  balance: number;
  cancelYn: 'Y' | 'N';
  date: string;
};
