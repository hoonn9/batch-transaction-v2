export type CheckCountRaw = {
  succeeded: number;
  failed: number;
  skipped: number;
};

export type ApiRequestCountRaw = {
  total: number;
  succeeded: number;
  failed: number;
};

export type BatchHistoryRaw = {
  id: string;
  activeMs: number;
  chunkSize: number;
  size: number;
  checkCount: CheckCountRaw;
  apiRequestCount: ApiRequestCountRaw;
  startedAt: Date;
  endedAt: Date;
  date: Date;
};
