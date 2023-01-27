import { TransactionRaw } from '../../transaction/outbound-adapter/type/tx-repository.type';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';

export abstract class TransactionCollectService {
  toEntity(raw: TransactionRaw) {
    const entity = new TransactionEntity();
    entity.amount = raw.amount;
    entity.balance = raw.balance;
    entity.date = new Date(raw.date);
    entity.transactionId = raw.transactionId;
    entity.storeId = raw.storeId;
    entity.cancelYn = raw.cancelYn;
    return entity;
  }
}
