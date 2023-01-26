import { Controller, Post } from '@nestjs/common';
import { MergeTxBatchFacade } from './merge-tx-batch.facade';

@Controller()
export class BatchController {
  constructor(private readonly mergeTxBatchFacade: MergeTxBatchFacade) {}

  @Post('trigger')
  async trigger() {
    await this.mergeTxBatchFacade.execute();
  }
}
