import { MergeTransactionEntity } from '../entity/merge-transaction.entity';
import { DatabaseService } from '../../database/database.interface';
import { Inject, Injectable } from '@nestjs/common';

export const MERGE_TRANSACTION_DATABASE_SERVICE =
  'MERGE_TRANSACTION_DATABASE_SERVICE' as const;

@Injectable()
export class MergeTxRepository {
  constructor(
    @Inject(MERGE_TRANSACTION_DATABASE_SERVICE)
    private readonly databaseService: DatabaseService<MergeTransactionEntity>,
  ) {}

  async save(
    entities: MergeTransactionEntity | MergeTransactionEntity[],
  ): Promise<void> {
    await this.databaseService.save(entities);
  }
}
