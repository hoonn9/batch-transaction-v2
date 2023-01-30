import { Injectable } from '@nestjs/common';
import { CollectStoreTxInboundPortOutputDto } from '../../../transaction-collect/inbound-port/collect-store-tx.inbound-port';
import { TransactionEntity } from '../../../transaction/entity/transaction.entity';
import { MergeTxBatchHistoryEntity } from '../merge-tx-batch-history/entity/merge-tx-batch-history.entity';
import { v4 } from 'uuid';

@Injectable()
export class BatchMergeTxCacheService {
  storeTxs: CollectStoreTxInboundPortOutputDto = {};
  mergeFailedTxs: TransactionEntity[] = [];

  registryFailTxs(txs: TransactionEntity[]) {
    this.mergeFailedTxs.push(...txs);
  }

  saveStoreTxsCache(storeTxs: CollectStoreTxInboundPortOutputDto) {
    Object.entries(storeTxs).forEach(([storeId, txs]) => {
      this.storeTxs[storeId] ??= {};

      Object.entries(txs).forEach(([txId, storeTx]) => {
        this.storeTxs[storeId][txId] = storeTx;
      });
    });
  }

  findStoreTx(tx: TransactionEntity) {
    return this.storeTxs[tx.storeId]?.[tx.transactionId] || null;
  }

  createHistory(batchHistoryId: string) {
    const entity = new MergeTxBatchHistoryEntity();
    entity.id = v4();
    entity.batchHistoryId = batchHistoryId;
    entity.failedTxs = this.mergeFailedTxs;
    return entity;
  }

  clear() {
    this.storeTxs = {};
    this.mergeFailedTxs = [];
  }
}
