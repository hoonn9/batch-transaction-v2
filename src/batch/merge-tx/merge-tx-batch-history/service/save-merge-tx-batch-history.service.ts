import { Inject, Injectable } from '@nestjs/common';
import {
  SaveMergeTxBatchHistoryInboundPort,
  SaveMergeTxBatchHistoryInboundPortInputDto,
  SaveMergeTxBatchHistoryInboundPortOutputDto,
} from '../inbound-port/save-merge-tx-batch-history.inbound-port';
import {
  SAVE_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT,
  SaveMergeTxBatchHistoryOutboundPort,
} from '../outbound-port/save-merge-tx-batch-history.outbound-port';

@Injectable()
export class SaveMergeTxBatchHistoryService
  implements SaveMergeTxBatchHistoryInboundPort
{
  constructor(
    @Inject(SAVE_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT)
    private readonly saveMergeTxBatchHistoryOutboundPort: SaveMergeTxBatchHistoryOutboundPort,
  ) {}

  async execute(
    params: SaveMergeTxBatchHistoryInboundPortInputDto,
  ): Promise<SaveMergeTxBatchHistoryInboundPortOutputDto> {
    await this.saveMergeTxBatchHistoryOutboundPort.execute(params);
  }
}
