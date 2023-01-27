import { TransactionEntity } from '../../transaction/entity/transaction.entity';

export type TransactionCollectInboundPortInputDto = {
  size: number;
  page: number;
};
export type TransactionCollectInboundPortOutputDto = TransactionEntity[] | null;

export interface TransactionCollectInboundPort {
  execute(
    params: TransactionCollectInboundPortInputDto,
  ): Promise<TransactionCollectInboundPortOutputDto>;
}

export const TRANSACTION_COLLECT_INBOUND_PORT =
  'TRANSACTION_COLLECT_INBOUND_PORT';
