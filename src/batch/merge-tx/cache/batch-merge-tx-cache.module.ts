import { Module } from '@nestjs/common';
import { BatchMergeTxCacheService } from './batch-merge-tx-cache.service';

@Module({
  providers: [BatchMergeTxCacheService],
  exports: [BatchMergeTxCacheService],
})
export class BatchMergeTxCacheModule {}
