import { Injectable } from '@nestjs/common';
import {
  PaginationBatchHistoryOutboundPort,
  PaginationBatchHistoryOutboundPortInputDto,
  PaginationBatchHistoryOutboundPortOutputDto,
} from '../outbound-port/pagination-batch-history.outbound-port';
import { BatchHistoryRepository } from './batch-history.repository';

@Injectable()
export class PaginationBatchHistoryAdapter
  implements PaginationBatchHistoryOutboundPort
{
  constructor(
    private readonly batchHistoryRepository: BatchHistoryRepository,
  ) {}
  execute(
    params: PaginationBatchHistoryOutboundPortInputDto,
  ): Promise<PaginationBatchHistoryOutboundPortOutputDto> {
    return this.batchHistoryRepository.findMany(
      {
        page: params.page,
        size: params.size,
      },
      {
        dateRange: params.dateRange,
      },
    );
  }
}
