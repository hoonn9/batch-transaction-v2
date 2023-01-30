import { Inject, Injectable } from '@nestjs/common';
import {
  FindMergeTxBatchHistoryInboundPort,
  FindMergeTxBatchHistoryInboundPortInputDto,
  FindMergeTxBatchHistoryInboundPortOutputDto,
} from '../inbound-port/find-merge-tx-batch-history.inbound-port';
import {
  FIND_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT,
  FindMergeTxBatchHistoryOutboundPort,
} from '../outbound-port/find-merge-tx-batch-history.outbound-port';

@Injectable()
export class FindMergeTxBatchHistoryService
  implements FindMergeTxBatchHistoryInboundPort
{
  constructor(
    @Inject(FIND_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT)
    private readonly retryFailedMergeTxOutboundPort: FindMergeTxBatchHistoryOutboundPort,
  ) {}

  async execute(
    params: FindMergeTxBatchHistoryInboundPortInputDto,
  ): Promise<FindMergeTxBatchHistoryInboundPortOutputDto> {
    return this.retryFailedMergeTxOutboundPort.execute(params);
  }
}
