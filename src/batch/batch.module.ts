import { Module, Provider } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { ApiMergeModule } from './merge-tx/api-merge/api-merge.module';
import { CsvMergeModule } from './merge-tx/csv-merge/csv-merge.module';
import { BatchMergeTxCacheModule } from './merge-tx/cache/batch-merge-tx-cache.module';
import { BatchMergeTxService } from './service/batch-merge-tx.service';
import { BatchMergeTxStatisticModule } from './merge-tx/statistic/batch-merge-tx-statistic.module';
import { NodeJsonDbModule } from '../database/node-json-db/node-json-db.module';
import { SAVE_BATCH_HISTORY_INBOUND_PORT } from './inbound-port/save-batch-history.inbound-port';
import { SaveBatchHistoryService } from './service/save-batch-history.service';
import { SAVE_BATCH_HISTORY_OUTBOUND_PORT } from './outbound-port/save-batch-history.outbound-port';
import { SaveBatchHistoryAdapter } from './outbound-adapter/save-batch-history.adapter';
import { BatchHistoryRepository } from './outbound-adapter/batch-history.repository';

const inboundPorts: Provider[] = [
  {
    provide: SAVE_BATCH_HISTORY_INBOUND_PORT,
    useClass: SaveBatchHistoryService,
  },
];

const outboundPorts: Provider[] = [
  {
    provide: SAVE_BATCH_HISTORY_OUTBOUND_PORT,
    useClass: SaveBatchHistoryAdapter,
  },
  BatchHistoryRepository,
];

@Module({
  imports: [
    NodeJsonDbModule.register('my-db'),
    BatchMergeTxStatisticModule,
    BatchMergeTxCacheModule,
    ApiMergeModule,
    CsvMergeModule,
  ],
  providers: [BatchMergeTxService, ...inboundPorts, ...outboundPorts],
  controllers: [BatchController],
})
export class BatchModule {}
