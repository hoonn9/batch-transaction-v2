import {
  CollectTransactionDto,
  CollectTransactionResponseDto,
} from '../../../src/transaction-collect/outbound-adapter/dto/api-collect-transaction.dto';
import { validate, validateOrReject, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { v4 } from 'uuid';
import { inspect } from 'util';

describe('ApiCollectTransactionDto', () => {
  describe('CollectionTransactionDto', () => {
    it('검증 성공 케이스', async () => {
      const plain = {
        transactionId: v4(),
        storeId: v4(),
        amount: 1000,
        balance: 1000,
        date: '1996-12-12',
        cancelYn: 'Y',
      };

      const dto = plainToInstance(CollectTransactionDto, plain, {});
      await validateOrReject(dto, {
        forbidUnknownValues: true,
        whitelist: true,
      });
    });

    it('검증 실패 케이스 - date 포맷은 YYYY-MM-DD, cancelYn은 Y 또는 N의 문자열이어야 한다.', async () => {
      const plain = {
        transactionId: v4(),
        storeId: v4(),
        amount: 1000,
        balance: 1000,
        date: '19960101',
        cancelYn: 'D',
      };

      const dto = plainToInstance(CollectTransactionDto, plain, {});
      const errors = await validate(dto, {
        forbidUnknownValues: true,
        whitelist: true,
      });
      expect(errors).toHaveLength(2);
    });
  });

  describe('CollectTransactionResponseDto', () => {
    it('검증 성공 케이스', async () => {
      const plain = {
        pageInfo: {
          totalPage: 1000,
        },
        list: [
          {
            transactionId: v4(),
            storeId: v4(),
            amount: 1000,
            balance: 1000,
            date: '1996-12-12',
            cancelYn: 'Y',
          },
          {
            transactionId: v4(),
            storeId: v4(),
            amount: 1000,
            balance: 1000,
            date: '1996-12-12',
            cancelYn: 'N',
          },
        ],
      };

      const dto = plainToInstance(CollectTransactionResponseDto, plain);
      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      expect(errors).toHaveLength(0);
    });

    it('검증 실패 케이스', async () => {
      const plain = {
        pageInfo: {
          totalPage: 1000,
          test: 111,
        },
        list: [
          {
            transactionId: v4(),
            storeId: v4(),
            amount: 1000,
            balance: 1000,
            date: '199612-12',
            cancelYn: 'Y',
          },
          {
            transactionId: v4(),
            storeId: v4(),
            amount: 1000,
            balance: 1000,
            date: '1996-12-12',
            cancelYn: 'Z',
          },
        ],
      };

      const dto = plainToInstance(CollectTransactionResponseDto, plain);

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      expect(errors).toHaveLength(2);
    });
  });

  test('skipMissingProperties', async () => {
    const plain = {
      transactionId: v4(),
      storeId: v4(),
      amount: 1000,
      balance: 1000,
      date: '1996-12-12',
      // cancelYn: 'Y',
    };

    const dto = plainToInstance(CollectTransactionDto, plain);

    await validateOrReject(dto, {
      skipMissingProperties: true,
    });
    const errors = await validate(dto, {
      skipMissingProperties: false,
    });

    expect(errors).toHaveLength(1);
  });

  test('whitelist', async () => {
    const plain = {
      transactionId: v4(),
      storeId: v4(),
      amount: 1000,
      balance: 1000,
      date: '1996-12-12',
      cancelYn: 'Y',
      fooProperty: 3,
    };

    const dto = plainToInstance(CollectTransactionDto, plain);

    try {
      await validateOrReject(plainToInstance(CollectTransactionDto, dto), {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
    } catch (errors: any) {
      expect(Array.isArray(errors)).toBe(true);

      for (const error of errors) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    }
  });
});
