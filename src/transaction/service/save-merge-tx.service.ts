import {
  SaveMergeTxInboundInputDto,
  SaveMergeTxInboundOutputDto,
  SaveMergeTxInboundPort,
} from '../inbound-port/save-merge-tx.inbound-port';
import { MergeTxRepository } from '../outbound-adapter/merge-tx.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaveMergeTxService implements SaveMergeTxInboundPort {
  constructor(private readonly mergeTxRepository: MergeTxRepository) {}

  async execute(
    params: SaveMergeTxInboundInputDto,
  ): SaveMergeTxInboundOutputDto {
    await this.mergeTxRepository.save(params.mergeTxs);
  }
}
