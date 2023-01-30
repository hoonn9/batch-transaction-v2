import { Inject, Injectable } from '@nestjs/common';
import {
  API_CHUNK_MERGE_SERVICE,
  CSV_CHUNK_MERGE_SERVICE,
} from '../merge-tx/service/chunk-merge-tx.inject-token';
import { ChunkMergeTxService } from '../merge-tx/service/chunk-merge-tx.service';
import { BatchMergeTxCacheService } from '../merge-tx/cache/batch-merge-tx-cache.service';
import { BatchStatisticService } from '../statistic/batch-statistic.service';
import {
  SAVE_MERGE_TX_BATCH_HISTORY_INBOUND_PORT,
  SaveMergeTxBatchHistoryInboundPort,
} from '../merge-tx/merge-tx-batch-history/inbound-port/save-merge-tx-batch-history.inbound-port';

@Injectable()
export class BatchMergeTxService {
  constructor(
    @Inject(API_CHUNK_MERGE_SERVICE)
    private readonly apiChunkMergeTxService: ChunkMergeTxService,

    @Inject(CSV_CHUNK_MERGE_SERVICE)
    private readonly csvChunkMergeTxService: ChunkMergeTxService,

    @Inject(SAVE_MERGE_TX_BATCH_HISTORY_INBOUND_PORT)
    private readonly saveMergeTxBatchHistoryInboundPort: SaveMergeTxBatchHistoryInboundPort,

    private readonly batchMergeTxCacheService: BatchMergeTxCacheService,
    private readonly batchStatisticService: BatchStatisticService,
  ) {}

  async execute(chunkSize: number, delayMs: number) {
    this.batchStatisticService.start(chunkSize);

    await Promise.all([
      this.apiChunkMergeTxService.execute(chunkSize, delayMs),
      this.csvChunkMergeTxService.execute(chunkSize, delayMs),
    ]);

    this.batchStatisticService.end();

    const batchHistoryEntity = this.batchStatisticService.createHistory();

    await this.saveMergeTxBatchHistoryInboundPort.execute([
      this.batchMergeTxCacheService.createHistory(batchHistoryEntity.id),
    ]);

    this.clear();
    return batchHistoryEntity;
  }

  private clear() {
    this.batchMergeTxCacheService.clear();
    this.batchStatisticService.clear();
  }
}
