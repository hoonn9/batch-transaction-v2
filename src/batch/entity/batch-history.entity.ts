export class CheckCount {
  succeeded: number;
  failed: number;
  skipped: number;
}

export class ApiRequestCount {
  total: number;
  succeeded: number;
  failed: number;
}

export class BatchHistoryEntity {
  id: string;
  activeMs: number;
  chunkSize: number;
  size: number;
  checkCount: CheckCount;
  apiRequestCount: ApiRequestCount;
  startedAt: Date;
  endedAt: Date;
  date: Date;
}
