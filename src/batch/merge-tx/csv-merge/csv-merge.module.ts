import { CsvCollectService } from '../../../transaction-collect/service/csv-collect.service';
import { Module } from '@nestjs/common';
import { TransactionModule } from '../../../transaction/transaction.module';
import { TransactionCollectModule } from '../../../transaction-collect/transaction-collect.module';
import { TRANSACTION_COLLECT_INBOUND_PORT } from '../../../transaction-collect/inbound-port/transaction-collect.inbound-port';
import { ChunkMergeTxService } from '../service/chunk-merge-tx.service';
import { CSV_CHUNK_MERGE_SERVICE } from '../service/chunk-merge-tx.inject-token';
import { CsvCollectAdapter } from '../../../transaction-collect/outbound-adapter/csv-collect.adapter';
import { CSV_COLLECT_OUTBOUND_PORT } from '../../../transaction-collect/outbound-port/csv-collect.outbound-port';
import { BatchMergeTxCacheModule } from '../cache/batch-merge-tx-cache.module';
import { BatchStatisticModule } from '../../statistic/batch-statistic.module';
import { SaveAndMergeTxService } from '../service/save-and-merge-tx.service';

@Module({
  imports: [
    TransactionModule,
    TransactionCollectModule,
    BatchMergeTxCacheModule,
    BatchStatisticModule,
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
      provide: CSV_CHUNK_MERGE_SERVICE,
      useClass: ChunkMergeTxService,
    },
    SaveAndMergeTxService,
  ],
  exports: [CSV_CHUNK_MERGE_SERVICE, SaveAndMergeTxService],
})
export class CsvMergeModule {}
