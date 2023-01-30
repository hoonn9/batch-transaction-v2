import { yyyyMMdd } from '../../lib/date';

export type TransactionRaw = {
  amount: number;
  balance: number;
  cancelYn: 'Y' | 'N';
  date: string; // yyyy-MM-dd
  storeId: string;
  transactionId: string;
};

export class TransactionEntity {
  transactionId!: string;
  storeId!: string;
  amount!: number;
  balance!: number;
  cancelYn!: 'Y' | 'N';
  date!: Date;

  static toRaw(entity: TransactionEntity): TransactionRaw {
    return {
      transactionId: entity.transactionId,
      storeId: entity.storeId,
      amount: entity.amount,
      balance: entity.balance,
      cancelYn: entity.cancelYn,
      date: yyyyMMdd(entity.date),
    };
  }

  static toEntity(raw: TransactionRaw): TransactionEntity {
    const entity = new TransactionEntity();
    entity.transactionId = raw.transactionId;
    entity.storeId = raw.storeId;
    entity.amount = raw.amount;
    entity.balance = raw.balance;
    entity.cancelYn = raw.cancelYn;
    entity.date = new Date(raw.date);
    return entity;
  }
}
