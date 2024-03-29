import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionCollectInboundPort,
  TransactionCollectInboundPortInputDto,
  TransactionCollectInboundPortOutputDto,
} from '../inbound-port/transaction-collect.inbound-port';
import {
  API_COLLECT_OUTBOUND_PORT,
  ApiCollectOutboundPort,
} from '../outbound-port/api-collect.outbound-port';
import { TransactionCollectService } from './transaction-collect.service';

@Injectable()
export class ApiCollectService
  extends TransactionCollectService
  implements TransactionCollectInboundPort
{
  constructor(
    @Inject(API_COLLECT_OUTBOUND_PORT)
    private readonly apiCollectOutboundPort: ApiCollectOutboundPort,
  ) {
    super();
  }

  async execute(
    params: TransactionCollectInboundPortInputDto,
  ): Promise<TransactionCollectInboundPortOutputDto> {
    const result = await this.apiCollectOutboundPort.execute(params);
    if (result) {
      return result.transactions.map(this.toEntity);
    }
    return result;
  }
}
