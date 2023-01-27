import { Module } from '@nestjs/common';
import { TransactionModule } from '../../../transaction/transaction.module';
import { TransactionCollectModule } from '../../../transaction-collect/transaction-collect.module';
import { TRANSACTION_COLLECT_INBOUND_PORT } from '../../../transaction-collect/inbound-port/transaction-collect.inbound-port';
import { ApiCollectService } from '../../../transaction-collect/service/api-collect.service';
import { BatchMergeTxFacade } from '../service/batch-merge-tx.facade';
import { API_COLLECT_BATCH_SERVICE } from '../service/batch-merge-tx.inject-token';
import { API_COLLECT_OUTBOUND_PORT } from '../../../transaction-collect/outbound-port/api-collect.outbound-port';
import { ApiCollectAdapter } from '../../../transaction-collect/outbound-adapter/api-collect.adapter';
import { FetchModule } from '../../../fetch/fetch.module';
import { BatchMergeTxCacheModule } from '../cache/batch-merge-tx-cache.module';

@Module({
  imports: [
    FetchModule,
    TransactionModule,
    TransactionCollectModule,
    BatchMergeTxCacheModule,
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
      provide: API_COLLECT_BATCH_SERVICE,
      useClass: BatchMergeTxFacade,
    },
  ],
  exports: [API_COLLECT_BATCH_SERVICE],
})
export class ApiMergeModule {}
