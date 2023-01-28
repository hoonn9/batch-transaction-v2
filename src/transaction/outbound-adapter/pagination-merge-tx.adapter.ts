import { Injectable } from '@nestjs/common';
import {
  PaginationMergeTxOutboundPort,
  PaginationMergeTxOutboundPortInputDto,
  PaginationMergeTxOutboundPortOutputDto,
} from '../outbound-port/pagination-merge-tx.outbound-port';
import { MergeTxRepository } from './merge-tx.repository';

@Injectable()
export class PaginationMergeTxAdapter implements PaginationMergeTxOutboundPort {
  constructor(private readonly mergeTxRepository: MergeTxRepository) {}

  async execute(
    params: PaginationMergeTxOutboundPortInputDto,
  ): Promise<PaginationMergeTxOutboundPortOutputDto> {
    return this.mergeTxRepository.findMany(
      {
        page: params.page,
        size: params.size,
      },
      {
        dateRange: params.dateRange,
      },
    );
  }
}
