import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTION_COLLECT_INBOUND_PORT,
  TransactionCollectInboundPort,
} from '../../../transaction-collect/inbound-port/transaction-collect.inbound-port';
import { delay } from '../../../lib/util';
import { SaveAndMergeTxService } from './save-and-merge-tx.service';

@Injectable()
export class ChunkMergeTxService {
  constructor(
    @Inject(TRANSACTION_COLLECT_INBOUND_PORT)
    private readonly transactionCollectInboundPort: TransactionCollectInboundPort,
    private readonly saveAndMergeTxService: SaveAndMergeTxService,
  ) {}

  async execute(chunkSize: number, delayMs: number) {
    await this.loop(1, chunkSize, delayMs);
  }

  private async loop(page: number, size: number, delayMs: number) {
    const txs = await this.transactionCollectInboundPort.execute({
      page,
      size,
    });

    if (txs === null) {
      return;
    }

    await this.saveAndMergeTxService.execute(txs);
    await delay(delayMs);
    // await this.loop(page + 1, size, delayMs);
  }
}
