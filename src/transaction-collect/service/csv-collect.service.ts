import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionCollectInboundPort,
  TransactionCollectInboundPortInputDto,
  TransactionCollectInboundPortOutputDto,
} from '../inbound-port/transaction-collect.inbound-port';
import {
  CSV_COLLECT_OUTBOUND_PORT,
  CsvCollectOutboundPort,
} from '../outbound-port/csv-collect.outbound-port';
import { TransactionCollectService } from './transaction-collect.service';

@Injectable()
export class CsvCollectService
  extends TransactionCollectService
  implements TransactionCollectInboundPort
{
  constructor(
    @Inject(CSV_COLLECT_OUTBOUND_PORT)
    private readonly csvCollectOutboundPort: CsvCollectOutboundPort,
  ) {
    super();
  }

  async execute(
    params: TransactionCollectInboundPortInputDto,
  ): Promise<TransactionCollectInboundPortOutputDto> {
    const result = await this.csvCollectOutboundPort.execute(params);
    if (result) {
      return result.map(this.toEntity);
    }
    return result;
  }
}
