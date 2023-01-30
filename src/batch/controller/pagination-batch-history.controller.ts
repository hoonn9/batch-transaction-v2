import {
  Controller,
  Get,
  Inject,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetBatchHistoriesQueryDto } from './dto/pagination-batch-history.dto';
import {
  PAGINATION_BATCH_HISTORY_INBOUND_PORT,
  PaginationBatchHistoryInboundPort,
} from '../inbound-port/pagination-batch-history.inbound-port';

@Controller('batch')
export class PaginationBatchHistoryController {
  constructor(
    @Inject(PAGINATION_BATCH_HISTORY_INBOUND_PORT)
    private readonly batchHistoryInboundPort: PaginationBatchHistoryInboundPort,
  ) {}

  @Get('history')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBatchHistories(@Query() query: GetBatchHistoriesQueryDto) {
    return this.batchHistoryInboundPort.execute({
      page: query.page,
      size: query.size,
      dateRange: {
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
      },
    });
  }
}
