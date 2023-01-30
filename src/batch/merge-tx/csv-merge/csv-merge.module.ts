import { CsvCollectService } from '../../../transaction-collect/service/csv-collect.service';
import { Module } from '@nestjs/common';
import { TransactionModule } from '../../../transaction/transaction.module';
import { TransactionCollectModule } from '../../../transaction-collect/transaction-collect.module';
import { TRANSACTION_COLLECT_INBOUND_PORT } from '../../../transaction-collect/inbound-port/transaction-collect.inbound-port';
import { BatchMergeTxFacade } from '../service/batch-merge-tx.facade';
import { CSV_COLLECT_BATCH_SERVICE } from '../service/batch-merge-tx.inject-token';
import { CsvCollectAdapter } from '../../../transaction-collect/outbound-adapter/csv-collect.adapter';
import { CSV_COLLECT_OUTBOUND_PORT } from '../../../transaction-collect/outbound-port/csv-collect.outbound-port';
import { BatchMergeTxCacheModule } from '../cache/batch-merge-tx-cache.module';
import { BatchMergeTxStatisticModule } from '../statistic/batch-merge-tx-statistic.module';

@Module({
  imports: [
    TransactionModule,
    TransactionCollectModule,
    BatchMergeTxCacheModule,
    BatchMergeTxStatisticModule,
  ],
  providers: [
    {
      provide: TRANSACTION_COLLECT_INBOUND_PORT,
      useClass: CsvCollectService,
    },
    {
      provide: CSV_COLLECT_OUTBOUND_PORT,
      useClass: CsvCollectAdapter,
    },
    {
      provide: CSV_COLLECT_BATCH_SERVICE,
      useClass: BatchMergeTxFacade,
    },
  ],
  exports: [CSV_COLLECT_BATCH_SERVICE],
})
export class CsvMergeModule {}
