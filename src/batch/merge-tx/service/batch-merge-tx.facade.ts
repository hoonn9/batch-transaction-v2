import { Inject, Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../../transaction/entity/transaction.entity';
import {
  COLLECT_STORE_TX_INBOUND_PORT,
  CollectStoreTxInboundPort,
  CollectStoreTxInboundPortOutputDto,
} from '../../../transaction-collect/inbound-port/collect-store-tx.inbound-port';
import {
  MERGE_TX_INBOUND_PORT,
  MergeTxInboundPort,
} from '../../../transaction/inbound-port/merge-tx.inbound-port';
import {
  TRANSACTION_COLLECT_INBOUND_PORT,
  TransactionCollectInboundPort,
} from '../../../transaction-collect/inbound-port/transaction-collect.inbound-port';
import { StoreTransactionEntity } from '../../../transaction/entity/store-transaction.entity';
import { MergeTransactionEntity } from '../../../transaction/entity/merge-transaction.entity';
import {
  SAVE_MERGE_TX_INBOUND_PORT,
  SaveMergeTxInboundPort,
} from '../../../transaction/inbound-port/save-merge-tx.inbound-port';
import {
  FIND_MERGE_TX_INBOUND_PORT,
  FindMergeTxInboundPort,
} from '../../../transaction/inbound-port/find-merge-tx.inbound-port';
import { BatchMergeTxCacheService } from '../cache/batch-merge-tx-cache.service';
import { FindStoreTxByTx, MergeTransactionTarget } from './batch-merge-tx.type';
import { delay } from '../../../lib/util';
import { BatchMergeTxStatisticService } from '../statistic/batch-merge-tx-statistic.service';

@Injectable()
export class BatchMergeTxFacade {
  constructor(
    @Inject(TRANSACTION_COLLECT_INBOUND_PORT)
    private readonly transactionCollectInboundPort: TransactionCollectInboundPort,

    @Inject(MERGE_TX_INBOUND_PORT)
    private readonly mergeTxInboundPort: MergeTxInboundPort,

    @Inject(SAVE_MERGE_TX_INBOUND_PORT)
    private readonly saveMergeTxInboundPort: SaveMergeTxInboundPort,

    @Inject(FIND_MERGE_TX_INBOUND_PORT)
    private readonly findMergeTxInboundPort: FindMergeTxInboundPort,

    @Inject(COLLECT_STORE_TX_INBOUND_PORT)
    private readonly collectStoreTxInboundPort: CollectStoreTxInboundPort,

    private readonly mergeTxBatchCacheService: BatchMergeTxCacheService,
    private readonly batchMergeTxStatisticService: BatchMergeTxStatisticService,
  ) {}

  async execute(chunkSize: number, delayMs: number) {
    await this.loop(1, chunkSize, delayMs);
  }

  private async loop(page: number, size: number, delayMs: number) {
    const txs = await this.transactionCollectInboundPort.execute({
      page,
      size,
    });

    if (txs === null) {
      return;
    }

    const mergeTxs = await this.mergeChunk(txs);
    await this.saveMergeTxInboundPort.execute({
      mergeTxs,
    });

    await delay(delayMs);
    await this.loop(page + 1, size, delayMs);
  }

  private async mergeChunk(
    txs: TransactionEntity[],
  ): Promise<MergeTransactionEntity[]> {
    const newTxs = await this.filterNewTxs(txs);

    this.batchMergeTxStatisticService.checkCount.skipped +=
      txs.length - newTxs.length;

    const cacheMergeResult = await this.mergeFromCache(newTxs);
    const apiMergeResult = await this.mergeFromApi(cacheMergeResult.notMatched);

    const merged = [...cacheMergeResult.result, ...apiMergeResult];

    this.batchMergeTxStatisticService.checkCount.succeeded += merged.length;
    this.batchMergeTxStatisticService.checkCount.failed +=
      newTxs.length - merged.length;

    return merged;
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

    const cacheMatchResult = this.matchStoreTx(txs, (tx) =>
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
