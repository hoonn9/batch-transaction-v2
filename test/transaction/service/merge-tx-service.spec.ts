import { Test } from '@nestjs/testing';
import { MergeTxService } from '../../../src/transaction/service/merge-tx.service';
import { MERGE_TX_OUTBOUND_PORT } from '../../../src/transaction/outbound-port/merge-tx.outbound-port';
import {
  MergeTxInboundInputDto,
  MergeTxInboundOutputDto,
} from '../../../src/transaction/inbound-port/merge-tx.inbound-port';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { yyyyMMdd } from '../../../src/lib/date';
import { MergeTxAdapter } from '../../../src/transaction/outbound-adapter/merge-tx.adapter';
import { BadRequestException } from '@nestjs/common';

describe('MergeTxService', () => {
  let mergeTxService: MergeTxService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        MergeTxService,
        {
          provide: MERGE_TX_OUTBOUND_PORT,
          useClass: MergeTxAdapter,
        },
      ],
    }).compile();

    mergeTxService = app.get(MergeTxService);
  });

  it('트랜잭션 ID, 스토어 ID가 같을 경우 병합된 엔티티를 반환한다.', () => {
    const input = mockInboundInput();

    const expected: MergeTxInboundOutputDto = {
      transactionId: input.tx.transactionId,
      storeId: input.storeTx.storeId,
      productId: input.storeTx.productId,
      amount: input.tx.amount,
      balance: input.tx.balance,
      date: input.tx.date,
      cancelYn: input.tx.cancelYn,
    };

    expect(mergeTxService.execute(input)).toEqual(expected);
  });

  it('트랜잭션 ID가 일치하지 않을 경우 예외를 발생시킨다.', () => {
    const input = mockInboundInput();
    input.storeTx.transactionId = v4();

    expect(() => mergeTxService.execute(input)).toThrow(BadRequestException);
  });

  it('스토어 ID가 일치하지 않을 경우 예외를 발생시킨다.', () => {
    const input = mockInboundInput();
    input.storeTx.storeId = v4();

    expect(() => mergeTxService.execute(input)).toThrow(BadRequestException);
  });
});

const mockInboundInput = (): MergeTxInboundInputDto => {
  const transactionId = v4();
  const storeId = v4();
  return {
    tx: {
      transactionId,
      storeId,
      amount: +faker.commerce.price(),
      balance: +faker.commerce.price(),
      date: yyyyMMdd(faker.date.recent(5)),
      cancelYn: faker.helpers.arrayElement(['Y', 'N']),
    },
    storeTx: {
      transactionId,
      storeId,
      productId: v4(),
    },
  };
};
