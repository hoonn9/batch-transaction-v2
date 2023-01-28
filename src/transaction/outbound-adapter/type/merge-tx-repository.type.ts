export type MergeTransactionRaw = {
  transactionId: string;
  productId: string;
  storeId: string;
  amount: number;
  balance: number;
  cancelYn: 'Y' | 'N';
  date: string;
};

export type MergeTxPaginationInput = {
  page: number;
  size: number;
};

export type MergeTxFindOptions = {
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
};
