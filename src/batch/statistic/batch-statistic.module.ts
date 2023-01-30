import { Module } from '@nestjs/common';
import { BatchStatisticService } from './batch-statistic.service';
import { FetchModule } from '../../fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [BatchStatisticService],
  exports: [BatchStatisticService],
})
export class BatchStatisticModule {}
