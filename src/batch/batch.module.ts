import { Module, Provider } from '@nestjs/common';
import { BatchMergeTxTriggerController } from './controller/batch-merge-tx-trigger.controller';
import { ApiMergeModule } from './merge-tx/api-merge/api-merge.module';
import { CsvMergeModule } from './merge-tx/csv-merge/csv-merge.module';
import { BatchMergeTxCacheModule } from './merge-tx/cache/batch-merge-tx-cache.module';
import { BatchMergeTxService } from './service/batch-merge-tx.service';
import { BatchStatisticModule } from './statistic/batch-statistic.module';
import { NodeJsonDbModule } from '../database/node-json-db/node-json-db.module';
import { SAVE_BATCH_HISTORY_INBOUND_PORT } from './inbound-port/save-batch-history.inbound-port';
import { SaveBatchHistoryService } from './service/save-batch-history.service';
import { SAVE_BATCH_HISTORY_OUTBOUND_PORT } from './outbound-port/save-batch-history.outbound-port';
import { SaveBatchHistoryAdapter } from './outbound-adapter/save-batch-history.adapter';
import { BatchHistoryRepository } from './outbound-adapter/batch-history.repository';
import { PaginationBatchHistoryController } from './controller/pagination-batch-history.controller';
import { PAGINATION_BATCH_HISTORY_INBOUND_PORT } from './inbound-port/pagination-batch-history.inbound-port';
import { PaginationBatchHistoryService } from './service/pagination-batch-history.service';
import { PAGINATION_BATCH_HISTORY_OUTBOUND_PORT } from './outbound-port/pagination-batch-history.outbound-port';
import { PaginationBatchHistoryAdapter } from './outbound-adapter/pagination-batch-history.adapter';
import { MergeTxBatchHistoryModule } from './merge-tx/merge-tx-batch-history/merge-tx-batch-history.module';
import { RetryFailedMergeTxController } from './controller/retry-failed-merge-tx.controller';
import { RetryFailedMergeTxService } from './service/retry-failed-merge-tx.service';

const inboundPorts: Provider[] = [
  {
    provide: SAVE_BATCH_HISTORY_INBOUND_PORT,
    useClass: SaveBatchHistoryService,
  },
  {
    provide: PAGINATION_BATCH_HISTORY_INBOUND_PORT,
    useClass: PaginationBatchHistoryService,
  },
];

const outboundPorts: Provider[] = [
  {
    provide: SAVE_BATCH_HISTORY_OUTBOUND_PORT,
    useClass: SaveBatchHistoryAdapter,
  },
  {
    provide: PAGINATION_BATCH_HISTORY_OUTBOUND_PORT,
    useClass: PaginationBatchHistoryAdapter,
  },
  BatchHistoryRepository,
];

const controllers = [
  PaginationBatchHistoryController,
  BatchMergeTxTriggerController,
  RetryFailedMergeTxController,
];

@Module({
  imports: [
    NodeJsonDbModule.register('my-db'),
    MergeTxBatchHistoryModule,
    BatchStatisticModule,
    BatchMergeTxCacheModule,
    ApiMergeModule,
    CsvMergeModule,
  ],
  providers: [
    BatchMergeTxService,
    RetryFailedMergeTxService,
    ...inboundPorts,
    ...outboundPorts,
  ],
  controllers: [...controllers],
})
export class BatchModule {}
