import { Module } from '@nestjs/common';
import { BatchMergeTxStatisticService } from './batch-merge-tx-statistic.service';
import { FetchModule } from '../../../fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [BatchMergeTxStatisticService],
  exports: [BatchMergeTxStatisticService],
})
export class BatchMergeTxStatisticModule {}
