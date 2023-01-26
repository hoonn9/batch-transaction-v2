import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [TransactionModule, BatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
