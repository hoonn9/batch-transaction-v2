import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationBatchHistoryInboundPort,
  PaginationBatchHistoryInboundPortInputDto,
  PaginationBatchHistoryInboundPortOutputDto,
} from '../inbound-port/pagination-batch-history.inbound-port';
import {
  PAGINATION_BATCH_HISTORY_OUTBOUND_PORT,
  PaginationBatchHistoryOutboundPort,
} from '../outbound-port/pagination-batch-history.outbound-port';

@Injectable()
export class PaginationBatchHistoryService
  implements PaginationBatchHistoryInboundPort
{
  constructor(
    @Inject(PAGINATION_BATCH_HISTORY_OUTBOUND_PORT)
    private readonly batchHistoryOutboundPort: PaginationBatchHistoryOutboundPort,
  ) {}
  execute(
    params: PaginationBatchHistoryInboundPortInputDto,
  ): Promise<PaginationBatchHistoryInboundPortOutputDto> {
    return this.batchHistoryOutboundPort.execute(params);
  }
}
