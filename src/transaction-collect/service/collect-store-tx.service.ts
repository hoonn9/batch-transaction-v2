import { Inject, Injectable } from '@nestjs/common';
import {
  FETCH_STORE_TX_OUTBOUND_PORT,
  FetchStoreTxOutboundPort,
  FetchStoreTxOutboundPortOutputDto,
} from '../outbound-port/fetch-store-tx.outbound-port';
import {
  CollectStoreTxInboundPort,
  CollectStoreTxInboundPortInputDto,
  CollectStoreTxInboundPortOutputDto,
} from '../inbound-port/collect-store-tx.inbound-port';
import { StoreTransactionEntity } from '../../transaction/entity/store-transaction.entity';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { yyyyMMdd } from '../../lib/date';
import { StoreTransactionDates } from './collect-store-tx.type';

@Injectable()
export class CollectStoreTxService implements CollectStoreTxInboundPort {
  constructor(
    @Inject(FETCH_STORE_TX_OUTBOUND_PORT)
    private readonly fetchStoreTxOutboundPort: FetchStoreTxOutboundPort,
  ) {}

  async execute(
    params: CollectStoreTxInboundPortInputDto,
  ): Promise<CollectStoreTxInboundPortOutputDto> {
    const result: CollectStoreTxInboundPortOutputDto = {};
    const promises = Object.entries(
      this.getStoreTransactionDates(params.txs),
    ).map(async ([storeId, { dates }]) => {
      return Promise.allSettled(
        dates.map(async (date) => {
          await this.updateByDate(result, storeId, date);
        }),
      );
    });

    await Promise.allSettled(promises);

    return result;
  }

  private getStoreTransactionDates(
    txs: TransactionEntity[],
  ): StoreTransactionDates {
    const result: StoreTransactionDates = {};

    txs.forEach((tx) => {
      result[tx.storeId] ??= { dates: [] };
      result[tx.storeId].dates.push(yyyyMMdd(tx.date));
    });

    return result;
  }

  private async updateByDate(
    collectResult: CollectStoreTxInboundPortOutputDto,
    storeId: string,
    date: string,
  ): Promise<void> {
    const result = await this.fetchStoreTxOutboundPort.execute({
      storeId: storeId,
      date,
    });

    result.map(this.toEntity).forEach((entity) => {
      collectResult[entity.storeId] ??= {};
      collectResult[entity.storeId][entity.transactionId] = entity;
    });
  }

  private toEntity(
    raw: FetchStoreTxOutboundPortOutputDto[number],
  ): StoreTransactionEntity {
    const entity = new StoreTransactionEntity();
    entity.storeId = raw.storeId;
    entity.transactionId = raw.transactionId;
    entity.productId = raw.productId;
    return entity;
  }
}
