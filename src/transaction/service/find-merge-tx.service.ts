import { Injectable } from '@nestjs/common';
import {
  FindMergeTxInboundPort,
  FindMergeTxInboundPortInputDto,
  FindMergeTxInboundPortOutputDto,
} from '../inbound-port/find-merge-tx.inbound-port';
import { MergeTxRepository } from '../outbound-adapter/merge-tx.repository';

@Injectable()
export class FindMergeTxService implements FindMergeTxInboundPort {
  constructor(private readonly mergeTxRepository: MergeTxRepository) {}

  async execute(
    params: FindMergeTxInboundPortInputDto,
  ): Promise<FindMergeTxInboundPortOutputDto> {
    return this.mergeTxRepository.findByTxId(params.transactionId);
  }
}
