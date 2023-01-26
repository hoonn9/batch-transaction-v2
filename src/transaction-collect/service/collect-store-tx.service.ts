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

    const promises = Object.entries(params).map(
      async ([storeId, { dates }]) => {
        return Promise.allSettled(
          dates.map(async (date) => {
            await this.updateByDate(result, storeId, date);
          }),
        );
      },
    );

    await Promise.allSettled(promises);

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
