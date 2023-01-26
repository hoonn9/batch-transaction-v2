import { Module } from '@nestjs/common';
import { MergeTxBatchFacade } from './merge-tx-batch.facade';
import { BatchController } from './batch.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionCollectModule } from '../transaction-collect/transaction-collect.module';

@Module({
  imports: [TransactionModule, TransactionCollectModule],
  controllers: [BatchController],
  providers: [MergeTxBatchFacade],
})
export class BatchModule {}
