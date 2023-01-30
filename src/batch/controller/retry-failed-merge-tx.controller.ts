import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { RetryFailedMergeTxService } from '../service/retry-failed-merge-tx.service';

@Controller('batch')
export class RetryFailedMergeTxController {
  constructor(
    private readonly retryFailedMergeTxService: RetryFailedMergeTxService,
  ) {}

  @Post('retry/:id')
  async retryFailedTxList(@Param('id', ParseUUIDPipe) id: string) {
    await this.retryFailedMergeTxService.execute(id);
  }
}
