import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { ApiMergeModule } from './merge-tx/api-merge/api-merge.module';
import { CsvMergeModule } from './merge-tx/csv-merge/csv-merge.module';
import { BatchMergeTxCacheModule } from './merge-tx/cache/batch-merge-tx-cache.module';

@Module({
  imports: [BatchMergeTxCacheModule, ApiMergeModule, CsvMergeModule],
  controllers: [BatchController],
})
export class BatchModule {}
