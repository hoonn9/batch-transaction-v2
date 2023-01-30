import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from '../../../../common/common-repository';
import { MergeTxBatchHistoryEntity } from '../entity/merge-tx-batch-history.entity';
import { NodeJsonDbService } from '../../../../database/node-json-db/node-json-db.service';
import { MergeTxBatchHistoryRaw } from './type/merge-tx-batch-history-repository.type';
import { TransactionEntity } from '../../../../transaction/entity/transaction.entity';

export const MERGE_TX_BATCH_HISTORY_DATABASE_SERVICE =
  'MERGE_TX_BATCH_HISTORY_DATABASE_SERVICE' as const;

@Injectable()
export class MergeTxBatchHistoryRepository extends CommonRepository<MergeTxBatchHistoryEntity> {
  constructor(
    @Inject(MERGE_TX_BATCH_HISTORY_DATABASE_SERVICE)
    private readonly databaseService: NodeJsonDbService<MergeTxBatchHistoryRaw>,
  ) {
    super();
  }

  async findById(id: string): Promise<MergeTxBatchHistoryEntity | undefined> {
    const raw = await this.databaseService.get<MergeTxBatchHistoryRaw>(
      `/${id}`,
    );

    if (!raw) {
      return;
    }
    return this.toEntity(raw);
  }

  async save(
    entities: MergeTxBatchHistoryEntity | MergeTxBatchHistoryEntity[],
  ): Promise<void> {
    if (Array.isArray(entities)) {
      await this.databaseService.save(entities.map(this.toRaw), 'id');
    } else {
      await this.databaseService.save(this.toRaw(entities), 'id');
    }
  }

  private toRaw(entity: MergeTxBatchHistoryEntity): MergeTxBatchHistoryRaw {
    return {
      id: entity.id,
      batchHistoryId: entity.batchHistoryId,
      failedTxs: entity.failedTxs.map(TransactionEntity.toRaw),
    };
  }

  private toEntity(raw: MergeTxBatchHistoryRaw) {
    const entity = new MergeTxBatchHistoryEntity();
    entity.id = raw.id;
    entity.batchHistoryId = raw.batchHistoryId;
    entity.failedTxs = raw.failedTxs.map(TransactionEntity.toEntity);
    return entity;
  }
}
