import { Controller, Inject, Post } from '@nestjs/common';
import { BatchMergeTxService } from '../service/batch-merge-tx.service';
import {
  SAVE_BATCH_HISTORY_INBOUND_PORT,
  SaveBatchHistoryInboundPort,
} from '../inbound-port/save-batch-history.inbound-port';

@Controller('batch')
export class BatchMergeTxTriggerController {
  constructor(
    private readonly mergeTxService: BatchMergeTxService,

    @Inject(SAVE_BATCH_HISTORY_INBOUND_PORT)
    private readonly saveBatchHistoryInboundPort: SaveBatchHistoryInboundPort,
  ) {}

  @Post('trigger')
  async trigger() {
    const batchHistory = await this.mergeTxService.execute(300, 1000);
    await this.saveBatchHistoryInboundPort.execute([batchHistory]);
  }
}
