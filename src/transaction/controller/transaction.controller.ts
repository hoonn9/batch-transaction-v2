import { Controller, Inject, Post } from '@nestjs/common';
import {
  SAVE_MERGE_TX_INBOUND_PORT,
  SaveMergeTxInboundPort,
} from '../inbound-port/save-merge-tx.inbound-port';
import { MergeTransactionEntity } from '../entity/merge-transaction.entity';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

@Controller()
export class TransactionController {
  constructor(
    @Inject(SAVE_MERGE_TX_INBOUND_PORT)
    private readonly saveMergeTxInboundPort: SaveMergeTxInboundPort,
  ) {}

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
