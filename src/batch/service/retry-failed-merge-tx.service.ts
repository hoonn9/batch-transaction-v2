import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FIND_MERGE_TX_BATCH_HISTORY_INBOUND_PORT,
  FindMergeTxBatchHistoryInboundPort,
} from '../merge-tx/merge-tx-batch-history/inbound-port/find-merge-tx-batch-history.inbound-port';
import { SaveAndMergeTxService } from '../merge-tx/service/save-and-merge-tx.service';

@Injectable()
export class RetryFailedMergeTxService {
  constructor(
    @Inject(FIND_MERGE_TX_BATCH_HISTORY_INBOUND_PORT)
    private readonly findMergeTxBatchHistoryInboundPort: FindMergeTxBatchHistoryInboundPort,

    private readonly saveAndMergeTxService: SaveAndMergeTxService,
  ) {}

  async execute(id: string) {
    const mergeTxBatchHistory =
      await this.findMergeTxBatchHistoryInboundPort.execute({
        id: id,
      });

    if (!mergeTxBatchHistory) {
      throw new NotFoundException();
    }

    await this.saveAndMergeTxService.execute(mergeTxBatchHistory.failedTxs);
  }
}
