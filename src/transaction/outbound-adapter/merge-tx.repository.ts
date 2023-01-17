import {
  MergeTxOutboundInputDto,
  MergeTxOutboundOutputDto,
  MergeTxOutboundPort,
} from '../outbound-port/merge-tx.outbound-port';
import { MergeTransactionEntity } from '../entity/merge-transaction.entity';

export class MergeTxRepository implements MergeTxOutboundPort {
  execute(params: MergeTxOutboundInputDto): MergeTxOutboundOutputDto {
    const entity = new MergeTransactionEntity();

    entity.transactionId = params.tx.transactionId;
    entity.productId = params.storeTx.productId;
    entity.storeId = params.storeTx.storeId;
    entity.amount = params.tx.amount;
    entity.balance = params.tx.balance;
    entity.cancelYn = params.tx.cancelYn;
    entity.date = params.tx.date;

    return entity;
  }
}
