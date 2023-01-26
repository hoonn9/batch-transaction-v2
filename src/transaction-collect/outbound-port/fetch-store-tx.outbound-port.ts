export type FetchStoreTxOutboundPortInputDto = {
  storeId: string;
  date: string;
};
export type FetchStoreTxOutboundPortOutputDto = {
  storeId: string;
  transactionId: string;
  productId: string;
}[];

export interface FetchStoreTxOutboundPort {
  execute(
    params: FetchStoreTxOutboundPortInputDto,
  ): Promise<FetchStoreTxOutboundPortOutputDto>;
}

export const FETCH_STORE_TX_OUTBOUND_PORT =
  'FETCH_STORE_TX_OUTBOUND_PORT' as const;
