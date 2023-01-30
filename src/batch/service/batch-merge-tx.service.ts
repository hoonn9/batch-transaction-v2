import { Inject, Injectable } from '@nestjs/common';
import {
  API_COLLECT_BATCH_SERVICE,
  CSV_COLLECT_BATCH_SERVICE,
} from '../merge-tx/service/batch-merge-tx.inject-token';
import { BatchMergeTxFacade } from '../merge-tx/service/batch-merge-tx.facade';
import { BatchMergeTxCacheService } from '../merge-tx/cache/batch-merge-tx-cache.service';
import { BatchMergeTxStatisticService } from '../merge-tx/statistic/batch-merge-tx-statistic.service';

@Injectable()
export class BatchMergeTxService {
  constructor(
    @Inject(API_COLLECT_BATCH_SERVICE)
    private readonly apiBatchMergeTxFacade: BatchMergeTxFacade,

    @Inject(CSV_COLLECT_BATCH_SERVICE)
    private readonly csvBatchMergeTxFacade: BatchMergeTxFacade,

    private readonly batchMergeTxCacheService: BatchMergeTxCacheService,
    private readonly batchMergeTxStatisticService: BatchMergeTxStatisticService,
  ) {}

  async execute(chunkSize: number, delayMs: number) {
    this.batchMergeTxStatisticService.start(chunkSize);

    await Promise.all([
      this.apiBatchMergeTxFacade.execute(chunkSize, delayMs),
      this.csvBatchMergeTxFacade.execute(chunkSize, delayMs),
    ]);

    this.batchMergeTxCacheService.clear();

    this.batchMergeTxStatisticService.end();
    const entity = this.batchMergeTxStatisticService.saveHistory();
    console.log(entity);
    this.batchMergeTxStatisticService.clear();

    return entity;
  }
}
