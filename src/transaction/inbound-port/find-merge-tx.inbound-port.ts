import { MergeTransactionEntity } from '../entity/merge-transaction.entity';

export type FindMergeTxInboundPortInputDto = {
  transactionId: string;
};

export type FindMergeTxInboundPortOutputDto = Promise<
  MergeTransactionEntity | undefined
>;

export interface FindMergeTxInboundPort {
  execute(
    params: FindMergeTxInboundPortInputDto,
  ): Promise<FindMergeTxInboundPortOutputDto>;
}

export const FIND_MERGE_TX_INBOUND_PORT = 'FIND_MERGE_TX_INBOUND_PORT' as const;
