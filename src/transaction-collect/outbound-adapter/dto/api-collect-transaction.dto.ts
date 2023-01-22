export type CollectTransactionResponseDto = {
  transactions: CollectTransactionDto[];
  pageInfo: CollectTransactionPageInfoDto;
};

export type CollectTransactionPageInfoDto = {
  totalPage: number;
};
export type CollectTransactionDto = {
  amount: number;
  balance: number;
  cancelYn: 'Y' | 'N';
  date: string; // yyyy-MM-dd
  storeId: string;
  transactionId: string;
};
