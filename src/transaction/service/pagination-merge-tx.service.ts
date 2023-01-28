import { Inject, Injectable } from '@nestjs/common';
import {
  PaginationMergeTxInboundPort,
  PaginationMergeTxInboundPortInputDto,
  PaginationMergeTxInboundPortOutputDto,
} from '../inbound-port/pagination-merge-tx.inbound-port';
import {
  PAGINATION_MERGE_TX_OUTBOUND_PORT,
  PaginationMergeTxOutboundPort,
} from '../outbound-port/pagination-merge-tx.outbound-port';

@Injectable()
export class PaginationMergeTxService implements PaginationMergeTxInboundPort {
  constructor(
    @Inject(PAGINATION_MERGE_TX_OUTBOUND_PORT)
    private readonly paginationMergeTxOutboundPort: PaginationMergeTxOutboundPort,
  ) {}

  async execute(
    params: PaginationMergeTxInboundPortInputDto,
  ): Promise<PaginationMergeTxInboundPortOutputDto> {
    return this.paginationMergeTxOutboundPort.execute(params);
  }
}
