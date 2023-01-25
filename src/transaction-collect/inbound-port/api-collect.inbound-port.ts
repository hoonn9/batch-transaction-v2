import { TransactionEntity } from '../../transaction/entity/transaction.entity';

export type ApiCollectInboundPortInputDto = void;
export type ApiCollectInboundPortOutputDto = TransactionEntity[];

export interface ApiCollectInboundPort {
  execute(
    params: ApiCollectInboundPortInputDto,
  ): Promise<ApiCollectInboundPortOutputDto>;
}

export const API_COLLECT_INBOUND_PORT = 'API_COLLECT_INBOUND_PORT';
