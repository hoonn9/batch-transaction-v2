import { Inject, Injectable } from '@nestjs/common';
import { TransactionEntity } from '../transaction/entity/transaction.entity';
import {
  COLLECT_STORE_TX_INBOUND_PORT,
  CollectStoreTxInboundPort,
  CollectStoreTxInboundPortInputDto,
  CollectStoreTxInboundPortOutputDto,
} from '../transaction-collect/inbound-port/collect-store-tx.inbound-port';
import { yyyyMMdd } from '../lib/date';
import {
  MERGE_TX_INBOUND_PORT,
  MergeTxInboundPort,
} from '../transaction/inbound-port/merge-tx.inbound-port';
import {
  API_COLLECT_INBOUND_PORT,
  ApiCollectInboundPort,
} from '../transaction-collect/inbound-port/api-collect.inbound-port';
import { StoreTransactionEntity } from '../transaction/entity/store-transaction.entity';
import { MergeTransactionEntity } from '../transaction/entity/merge-transaction.entity';
import {
  SAVE_MERGE_TX_INBOUND_PORT,
  SaveMergeTxInboundPort,
} from '../transaction/inbound-port/save-merge-tx.inbound-port';

@Injectable()
export class MergeTxBatchFacade {
  constructor(
    @Inject(API_COLLECT_INBOUND_PORT)
    private readonly apiCollectInboundPort: ApiCollectInboundPort,

    @Inject(MERGE_TX_INBOUND_PORT)
    private readonly mergeTxInboundPort: MergeTxInboundPort,

    @Inject(SAVE_MERGE_TX_INBOUND_PORT)
    private readonly saveMergeTxInboundPort: SaveMergeTxInboundPort,

    @Inject(COLLECT_STORE_TX_INBOUND_PORT)
    private readonly collectStoreTxInboundPort: CollectStoreTxInboundPort,
  ) {}

  async execute() {
    const chunkSize = 30;
    const txs = await this.apiCollectInboundPort.execute();

    for (const chunk of this.makeChunk(txs, chunkSize)) {
      const storeTxs = await this.collectStoreTxInboundPort.execute(
        this.getStoreTransactionDates(chunk),
      );

      const result = this.merge(chunk, storeTxs);

      console.log('merged length: ', result.merged.length);
      console.log('failed length: ', result.failed.length);
      await this.saveMergeTxInboundPort.execute({
        mergeTxs: result.merged,
      });
      await this.delay(1000);
    }
  }

  makeChunk(txs: TransactionEntity[], chunkSize: number) {
    const result: TransactionEntity[][] = [];

    for (let i = 0; i < txs.length; i += chunkSize) {
      result.push(txs.slice(i, i + chunkSize));
    }

    return result;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private merge(
    txs: TransactionEntity[],
    storeTxs: CollectStoreTxInboundPortOutputDto,
  ) {
    const merged: MergeTransactionEntity[] = [];
    const failed: TransactionEntity[] = [];

    txs.forEach((tx) => {
      const foundStoreTx = this.findStoreTx(tx, storeTxs);

      if (foundStoreTx) {
        const mergeTx = this.mergeTxInboundPort.execute({
          tx,
          storeTx: foundStoreTx,
        });

        merged.push(mergeTx);
      } else {
        failed.push(tx);
      }
    });

    return {
      merged,
      failed,
    };
  }

  private findStoreTx(
    tx: TransactionEntity,
    storeTxs: CollectStoreTxInboundPortOutputDto,
  ): StoreTransactionEntity | null {
    return storeTxs[tx.storeId]?.[tx.transactionId] || null;
  }

  private getStoreTransactionDates(
    txs: TransactionEntity[],
  ): CollectStoreTxInboundPortInputDto {
    const result: CollectStoreTxInboundPortInputDto = {};

    txs.forEach((tx) => {
      result[tx.storeId] ??= { dates: [] };
      result[tx.storeId].dates.push(yyyyMMdd(tx.date));
    });

    return result;
  }
}
