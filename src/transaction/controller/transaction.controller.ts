import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  SAVE_MERGE_TX_INBOUND_PORT,
  SaveMergeTxInboundPort,
} from '../inbound-port/save-merge-tx.inbound-port';
import { MergeTransactionEntity } from '../entity/merge-transaction.entity';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import {
  PAGINATION_MERGE_TX_INBOUND_PORT,
  PaginationMergeTxInboundPort,
} from '../inbound-port/pagination-merge-tx.inbound-port';
import { GetMergeTxsQueryDto } from './dto/get-merge-txs.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(SAVE_MERGE_TX_INBOUND_PORT)
    private readonly saveMergeTxInboundPort: SaveMergeTxInboundPort,

    @Inject(PAGINATION_MERGE_TX_INBOUND_PORT)
    private readonly paginationMergeTxInboundPort: PaginationMergeTxInboundPort,
  ) {}

  @Get('/merge')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMergeTxs(@Query() query: GetMergeTxsQueryDto) {
    console.log(query);
    return this.paginationMergeTxInboundPort.execute({
      size: query.size,
      page: query.page,
      dateRange: {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      },
    });
  }

  @Post('mergetx/save')
  async execute() {
    const merge = new MergeTransactionEntity();
    merge.transactionId = v4();
    merge.storeId = v4();
    merge.amount = +faker.commerce.price();
    merge.balance = +faker.commerce.price();
    merge.date = faker.date.recent(5);
    merge.cancelYn = faker.helpers.arrayElement(['Y', 'N']);

    await this.saveMergeTxInboundPort.execute({
      mergeTxs: [merge],
    });
  }
}
