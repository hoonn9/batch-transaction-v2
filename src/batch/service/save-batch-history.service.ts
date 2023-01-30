import { Inject, Injectable } from '@nestjs/common';
import {
  SaveBatchHistoryInboundPort,
  SaveBatchHistoryInboundPortInputDto,
  SaveBatchHistoryInboundPortOutputDto,
} from '../inbound-port/save-batch-history.inbound-port';
import {
  SAVE_BATCH_HISTORY_OUTBOUND_PORT,
  SaveBatchHistoryOutboundPort,
} from '../outbound-port/save-batch-history.outbound-port';

@Injectable()
export class SaveBatchHistoryService implements SaveBatchHistoryInboundPort {
  constructor(
    @Inject(SAVE_BATCH_HISTORY_OUTBOUND_PORT)
    private readonly batchHistoryOutboundPort: SaveBatchHistoryOutboundPort,
  ) {}

  async execute(
    params: SaveBatchHistoryInboundPortInputDto,
  ): Promise<SaveBatchHistoryInboundPortOutputDto> {
    await this.batchHistoryOutboundPort.execute(params);
  }
}
