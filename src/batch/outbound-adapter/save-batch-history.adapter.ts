import { Injectable } from '@nestjs/common';
import {
  SaveBatchHistoryOutboundPort,
  SaveBatchHistoryOutboundPortInputDto,
  SaveBatchHistoryOutboundPortOutputDto,
} from '../outbound-port/save-batch-history.outbound-port';
import { BatchHistoryRepository } from './batch-history.repository';

@Injectable()
export class SaveBatchHistoryAdapter implements SaveBatchHistoryOutboundPort {
  constructor(
    private readonly batchHistoryRepository: BatchHistoryRepository,
  ) {}

  async execute(
    params: SaveBatchHistoryOutboundPortInputDto,
  ): Promise<SaveBatchHistoryOutboundPortOutputDto> {
    await this.batchHistoryRepository.save(params);
  }
}
