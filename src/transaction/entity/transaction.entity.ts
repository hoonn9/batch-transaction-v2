export class TransactionEntity {
  transactionId!: string;
  storeId!: string;
  amount!: number;
  balance!: number;
  cancelYn!: 'Y' | 'N';
  date!: string; // yyyy-MM-dd
}