import { Injectable } from '@nestjs/common';
import { BatchHistoryEntity, CheckCount } from '../entity/batch-history.entity';
import { FetchStatisticService } from '../../fetch/fetch-statistic.service';
import { performance } from 'perf_hooks';
import { v4 } from 'uuid';

@Injectable()
export class BatchStatisticService {
  chunkSize: number;
  startMs: number;
  startedAt: Date;
  endMs: number;
  endedAt: Date;

  checkCount: CheckCount = {
    failed: 0,
    skipped: 0,
    succeeded: 0,
  };

  constructor(private readonly fetchStatisticService: FetchStatisticService) {}

  start(chunkSize: number) {
    this.chunkSize = chunkSize;

    this.startMs = performance.now();
    this.startedAt = new Date();
  }

  end() {
    this.endMs = performance.now();
    this.endedAt = new Date();
  }

  createHistory() {
    const activeMs = this.endMs - this.startMs;

    const entity = new BatchHistoryEntity();
    entity.id = v4();
    entity.chunkSize = this.chunkSize;
    entity.endedAt = this.endedAt;
    entity.startedAt = this.startedAt;
    entity.activeMs = activeMs;

    entity.apiRequestCount = this.getCount().apiRequestCount;
    entity.checkCount = this.getCount().checkCount;

    return entity;
  }

  getCount() {
    return {
      checkCount: this.checkCount,
      apiRequestCount: this.fetchStatisticService.apiRequestCount,
    };
  }

  clear() {
    this.checkCount = {
      failed: 0,
      skipped: 0,
      succeeded: 0,
    };
  }
}
