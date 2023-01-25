import { Inject, Injectable } from '@nestjs/common';
import {
  ApiCollectInboundPort,
  ApiCollectInboundPortInputDto,
  ApiCollectInboundPortOutputDto,
} from '../inbound-port/api-collect.inbound-port';
import {
  API_COLLECT_OUTBOUND_PORT,
  ApiCollectOutboundPort,
  ApiCollectOutboundPortOutputDto,
} from '../outbound-port/api-collect.outbound-port';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';

@Injectable()
export class ApiCollectService implements ApiCollectInboundPort {
  constructor(
    @Inject(API_COLLECT_OUTBOUND_PORT)
    private readonly apiCollectOutboundPort: ApiCollectOutboundPort,
  ) {}

  async execute(
    params: ApiCollectInboundPortInputDto,
  ): Promise<ApiCollectInboundPortOutputDto> {
    const result = await this.apiCollectOutboundPort.execute();
    return result.transactions.map(this.toEntity);
  }

  private toEntity(
    raw: ApiCollectOutboundPortOutputDto['transactions'][number],
  ): TransactionEntity {
    const entity = new TransactionEntity();
    entity.amount = raw.amount;
    entity.balance = raw.balance;
    entity.date = new Date(raw.date);
    entity.transactionId = raw.transactionId;
    entity.storeId = raw.storeId;
    entity.cancelYn = raw.cancelYn;
    return entity;
  }
}
