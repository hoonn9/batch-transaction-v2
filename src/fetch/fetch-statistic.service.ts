import { Injectable } from '@nestjs/common';
import { ApiRequestCount } from '../batch/entity/batch-history.entity';

@Injectable()
export class FetchStatisticService {
  apiRequestCount: ApiRequestCount = {
    failed: 0,
    succeeded: 0,
    total: 0,
  };
}
