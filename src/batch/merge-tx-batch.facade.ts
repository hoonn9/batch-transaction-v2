import { Inject, Injectable } from '@nestjs/common';
import { TransactionEntity } from '../transaction/entity/transaction.entity';
import {
  COLLECT_STORE_TX_INBOUND_PORT,
  CollectStoreTxInboundPort,
  CollectStoreTxInboundPortOutputDto,
} from '../transaction-collect/inbound-port/collect-store-tx.inbound-port';
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
import {
  FIND_MERGE_TX_INBOUND_PORT,
  FindMergeTxInboundPort,
} from '../transaction/inbound-port/find-merge-tx.inbound-port';
import { MergeTxBatchCacheService } from './merge-tx-batch-cache.service';
import { FindStoreTxByTx, MergeTransactionTarget } from './merge-tx-batch.type';
import { delay, makeChunk } from '../lib/util';

@Injectable()
export class MergeTxBatchFacade {
  constructor(
    @Inject(API_COLLECT_INBOUND_PORT)
    private readonly apiCollectInboundPort: ApiCollectInboundPort,

    @Inject(MERGE_TX_INBOUND_PORT)
    private readonly mergeTxInboundPort: MergeTxInboundPort,

    @Inject(SAVE_MERGE_TX_INBOUND_PORT)
    private readonly saveMergeTxInboundPort: SaveMergeTxInboundPort,

    @Inject(FIND_MERGE_TX_INBOUND_PORT)
    private readonly findMergeTxInboundPort: FindMergeTxInboundPort,

    @Inject(COLLECT_STORE_TX_INBOUND_PORT)
    private readonly collectStoreTxInboundPort: CollectStoreTxInboundPort,

    private readonly mergeTxBatchCacheService: MergeTxBatchCacheService,
  ) {}

  async execute() {
    const chunkSize = 300;
    const txs = await this.apiCollectInboundPort.execute();

    for (const chunk of makeChunk(txs, chunkSize)) {
      const mergeTxs = await this.mergeChunk(chunk);

      console.log('merged: ', mergeTxs.length);

      await this.saveMergeTxInboundPort.execute({
        mergeTxs,
      });
      await delay(1000);
    }
  }

  private async mergeChunk(
    txs: TransactionEntity[],
  ): Promise<MergeTransactionEntity[]> {
    const cacheMergeResult = await this.mergeFromCache(txs);
    const apiMergeResult = await this.mergeFromApi(cacheMergeResult.notMatched);

    return [...cacheMergeResult.result, ...apiMergeResult];
  }

  private async mergeFromApi(txs: TransactionEntity[]) {
    const result: MergeTransactionEntity[] = [];

    const storeTxMap = await this.getStoreTxMapByTxs(txs);
    const matchResult = this.matchStoreTx(txs, (tx) =>
      this.findStoreTx(tx, storeTxMap),
    );

    result.push(...this.merge(matchResult.target));

    return result;
  }

  private async mergeFromCache(txs: TransactionEntity[]) {
    const result: MergeTransactionEntity[] = [];

    const newTxs = await this.filterNewTxs(txs);
    const cacheMatchResult = this.matchStoreTx(newTxs, (tx) =>
      this.mergeTxBatchCacheService.findStoreTx(tx),
    );

    result.push(...this.merge(cacheMatchResult.target));
    return { result, notMatched: cacheMatchResult.notMatched };
  }

  private async getStoreTxMapByTxs(txs: TransactionEntity[]) {
    const result = await this.collectStoreTxInboundPort.execute({
      txs,
    });

    this.mergeTxBatchCacheService.saveStoreTxsCache(result);

    return result;
  }

  private matchStoreTx(
    txs: TransactionEntity[],
    findStoreTxByTx: FindStoreTxByTx,
  ) {
    const target: MergeTransactionTarget[] = [];
    const notMatched: TransactionEntity[] = [];

    txs.forEach((tx) => {
      const storeTx = findStoreTxByTx(tx);

      if (storeTx) {
        return target.push({
          tx,
          storeTx,
        });
      }
      notMatched.push(tx);
    });

    return {
      target,
      notMatched,
    };
  }

  private merge(targets: MergeTransactionTarget[]) {
    return targets.map((target) =>
      this.mergeTxInboundPort.execute({
        tx: target.tx,
        storeTx: target.storeTx,
      }),
    );
  }

  async filterNewTxs(txs: TransactionEntity[]) {
    const result: TransactionEntity[] = [];

    await Promise.all(
      txs.map(async (tx) => {
        const mergeTx = await this.findMergeTxInboundPort.execute({
          transactionId: tx.transactionId,
        });
        if (!mergeTx) {
          result.push(tx);
        }
      }),
    );

    return result;
  }

  private findStoreTx(
    tx: TransactionEntity,
    storeTxs: CollectStoreTxInboundPortOutputDto,
  ): StoreTransactionEntity | null {
    return storeTxs[tx.storeId]?.[tx.transactionId] || null;
  }
}
