import { Inject, Injectable } from '@nestjs/common';
import { NodeJsonDbService } from '../../database/node-json-db/node-json-db.service';
import { BatchHistoryEntity } from '../entity/batch-history.entity';
import {
  BatchHistoryFindOptions,
  BatchHistoryPaginationInput,
  BatchHistoryRaw,
} from './type/batch-history-repository.type';
import { CommonRepository } from '../../common/common-repository';

export const BATCH_HISTORY_DATABASE_SERVICE =
  'BATCH_HISTORY_DATABASE_SERVICE' as const;

@Injectable()
export class BatchHistoryRepository extends CommonRepository<BatchHistoryEntity> {
  constructor(
    @Inject(BATCH_HISTORY_DATABASE_SERVICE)
    private readonly databaseService: NodeJsonDbService<BatchHistoryRaw>,
  ) {
    super();
  }

  async findMany(
    pagination: BatchHistoryPaginationInput,
    options: BatchHistoryFindOptions,
  ) {
    const result = {
      entities: [] as BatchHistoryEntity[],
      pageInfo: {
        totalPage: 0,
      },
    };

    const rawsObject = await this.databaseService.get<
      Record<string, BatchHistoryRaw>
    >('');

    if (rawsObject) {
      const allEntities = Object.values(rawsObject).map(this.toEntity);
      const appliedOptionEntities = this.applyFindOption(allEntities, options);
      result.entities = this.applyPagination(appliedOptionEntities, pagination);

      result.pageInfo.totalPage = Math.ceil(
        appliedOptionEntities.length / pagination.size,
      );
    }
    return result;
  }

  private applyFindOption(
    raws: BatchHistoryEntity[],
    options: BatchHistoryFindOptions,
  ) {
    return this.applyDateRange(raws, 'date', options.dateRange);
  }

  async save(
    entities: BatchHistoryEntity | BatchHistoryEntity[],
  ): Promise<void> {
    if (Array.isArray(entities)) {
      await this.databaseService.save(entities.map(this.toRaw), 'id');
    } else {
      await this.databaseService.save(this.toRaw(entities), 'id');
    }
  }

  private toRaw(entity: BatchHistoryEntity): BatchHistoryRaw {
    return {
      id: entity.id,
      activeMs: entity.activeMs,
      chunkSize: entity.chunkSize,
      size: entity.size,
      checkCount: entity.checkCount,
      apiRequestCount: entity.apiRequestCount,
      startedAt: entity.startedAt,
      endedAt: entity.endedAt,
      date: entity.date,
    };
  }

  private toEntity(raw: BatchHistoryRaw) {
    const entity = new BatchHistoryEntity();
    entity.id = raw.id;
    entity.activeMs = raw.activeMs;
    entity.chunkSize = raw.chunkSize;
    entity.size = raw.size;
    entity.checkCount = raw.checkCount;
    entity.apiRequestCount = raw.apiRequestCount;
    entity.startedAt = raw.startedAt;
    entity.endedAt = raw.endedAt;
    entity.date = raw.date;
    return entity;
  }

  clear() {
    return this.databaseService.drop();
  }
}
