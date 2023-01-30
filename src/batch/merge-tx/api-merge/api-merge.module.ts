import { Module } from '@nestjs/common';
import { TransactionModule } from '../../../transaction/transaction.module';
import { TransactionCollectModule } from '../../../transaction-collect/transaction-collect.module';
import { TRANSACTION_COLLECT_INBOUND_PORT } from '../../../transaction-collect/inbound-port/transaction-collect.inbound-port';
import { ApiCollectService } from '../../../transaction-collect/service/api-collect.service';
import { ChunkMergeTxService } from '../service/chunk-merge-tx.service';
import { API_CHUNK_MERGE_SERVICE } from '../service/chunk-merge-tx.inject-token';
import { API_COLLECT_OUTBOUND_PORT } from '../../../transaction-collect/outbound-port/api-collect.outbound-port';
import { ApiCollectAdapter } from '../../../transaction-collect/outbound-adapter/api-collect.adapter';
import { FetchModule } from '../../../fetch/fetch.module';
import { BatchMergeTxCacheModule } from '../cache/batch-merge-tx-cache.module';
import { BatchStatisticModule } from '../../statistic/batch-statistic.module';
import { SaveAndMergeTxService } from '../service/save-and-merge-tx.service';

@Module({
  imports: [
    FetchModule,
    TransactionModule,
    TransactionCollectModule,
    BatchMergeTxCacheModule,
    BatchStatisticModule,
  ],
  providers: [
    {
      provide: TRANSACTION_COLLECT_INBOUND_PORT,
      useClass: ApiCollectService,
    },
    {
      provide: API_COLLECT_OUTBOUND_PORT,
      useClass: ApiCollectAdapter,
    },
    {
      provide: API_CHUNK_MERGE_SERVICE,
      useClass: ChunkMergeTxService,
    },
    SaveAndMergeTxService,
  ],
  exports: [API_CHUNK_MERGE_SERVICE, SaveAndMergeTxService],
})
export class ApiMergeModule {}
