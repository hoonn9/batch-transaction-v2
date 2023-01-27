import { Controller, Inject, Post } from '@nestjs/common';
import { BatchMergeTxFacade } from './merge-tx/service/batch-merge-tx.facade';
import {
  API_COLLECT_BATCH_SERVICE,
  CSV_COLLECT_BATCH_SERVICE,
} from './merge-tx/service/batch-merge-tx.inject-token';
import { BatchMergeTxCacheService } from './merge-tx/cache/batch-merge-tx-cache.service';

@Controller()
export class BatchController {
  constructor(
    @Inject(API_COLLECT_BATCH_SERVICE)
    private readonly apiBatchMergeTxFacade: BatchMergeTxFacade,

    @Inject(CSV_COLLECT_BATCH_SERVICE)
    private readonly csvBatchMergeTxFacade: BatchMergeTxFacade,

    private readonly batchMergeTxCacheService: BatchMergeTxCacheService,
  ) {}

  @Post('trigger')
  async trigger() {
    await Promise.all([
      this.apiBatchMergeTxFacade.execute(),
      this.csvBatchMergeTxFacade.execute(),
    ]);

    this.batchMergeTxCacheService.clear();
  }
}
