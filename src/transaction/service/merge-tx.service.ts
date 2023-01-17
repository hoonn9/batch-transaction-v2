import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  MergeTxInboundInputDto,
  MergeTxInboundOutputDto,
  MergeTxInboundPort,
} from '../inbound-port/merge-tx.inbound-port';
import {
  MERGE_TX_OUTBOUND_PORT,
  MergeTxOutboundPort,
} from '../outbound-port/merge-tx.outbound-port';

@Injectable()
export class MergeTxService implements MergeTxInboundPort {
  constructor(
    @Inject(MERGE_TX_OUTBOUND_PORT)
    private readonly mergeTxOutboundPort: MergeTxOutboundPort,
  ) {}

  execute(params: MergeTxInboundInputDto): MergeTxInboundOutputDto {
    this.canMerge(params);
    return this.mergeTxOutboundPort.execute(params);
  }

  private canMerge(params: MergeTxInboundInputDto): void {
    if (params.tx.transactionId !== params.storeTx.transactionId) {
      throw new BadRequestException();
    }

    if (params.tx.storeId !== params.storeTx.storeId) {
      throw new BadRequestException();
    }
  }
}
