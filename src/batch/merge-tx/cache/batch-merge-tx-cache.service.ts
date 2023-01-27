import { Injectable } from '@nestjs/common';
import { CollectStoreTxInboundPortOutputDto } from '../../../transaction-collect/inbound-port/collect-store-tx.inbound-port';
import { TransactionEntity } from '../../../transaction/entity/transaction.entity';

@Injectable()
export class BatchMergeTxCacheService {
  storeTxs: CollectStoreTxInboundPortOutputDto = {};

  constructor() {
    console.log('construct batch cache');
  }

  saveStoreTxsCache(storeTxs: CollectStoreTxInboundPortOutputDto) {
    Object.entries(storeTxs).forEach(([storeId, txs]) => {
      this.storeTxs[storeId] ??= {};

      Object.entries(txs).forEach(([txId, storeTx]) => {
        this.storeTxs[storeId][txId] = storeTx;
      });
    });

    console.log('saveStoreTxsCache length', Object.keys(this.storeTxs).length);
  }

  findStoreTx(tx: TransactionEntity) {
    return this.storeTxs[tx.storeId]?.[tx.transactionId] || null;
  }

  clear() {
    this.storeTxs = {};
  }
}
