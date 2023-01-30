import { Injectable } from '@nestjs/common';
import {
  FindMergeTxBatchHistoryOutboundPort,
  FindMergeTxBatchHistoryOutboundPortInputDto,
  FindMergeTxBatchHistoryOutboundPortOutputDto,
} from '../outbound-port/find-merge-tx-batch-history.outbound-port';
import { MergeTxBatchHistoryRepository } from './merge-tx-batch-history.repository';

@Injectable()
export class FindMergeTxBatchHistoryAdapter
  implements FindMergeTxBatchHistoryOutboundPort
{
  constructor(
    private readonly mergeTxBatchHistoryRepository: MergeTxBatchHistoryRepository,
  ) {}

  async execute(
    params: FindMergeTxBatchHistoryOutboundPortInputDto,
  ): Promise<FindMergeTxBatchHistoryOutboundPortOutputDto> {
    return this.mergeTxBatchHistoryRepository.findById(params.id);
  }
}
