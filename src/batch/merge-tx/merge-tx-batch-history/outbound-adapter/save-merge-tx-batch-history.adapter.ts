import { Injectable } from '@nestjs/common';
import {
  SaveMergeTxBatchHistoryOutboundPort,
  SaveMergeTxBatchHistoryOutboundPortInputDto,
  SaveMergeTxBatchHistoryOutboundPortOutputDto,
} from '../outbound-port/save-merge-tx-batch-history.outbound-port';
import { MergeTxBatchHistoryRepository } from './merge-tx-batch-history.repository';

@Injectable()
export class SaveMergeTxBatchHistoryAdapter
  implements SaveMergeTxBatchHistoryOutboundPort
{
  constructor(
    private readonly batchHistoryRepository: MergeTxBatchHistoryRepository,
  ) {}

  async execute(
    params: SaveMergeTxBatchHistoryOutboundPortInputDto,
  ): Promise<SaveMergeTxBatchHistoryOutboundPortOutputDto> {
    await this.batchHistoryRepository.save(params);
  }
}
