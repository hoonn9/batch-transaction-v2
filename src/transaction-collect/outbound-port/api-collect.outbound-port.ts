export type ApiCollectOutboundPortInputDto = void;
export type ApiCollectOutboundPortOutputDto = {
  transactions: {
    amount: number;
    balance: number;
    cancelYn: 'Y' | 'N';
    date: string; // yyyy-MM-dd
    storeId: string;
    transactionId: string;
  }[];
  failedPages: number[];
};

export interface ApiCollectOutboundPort {
  execute(
    params: ApiCollectOutboundPortInputDto,
  ): Promise<ApiCollectOutboundPortOutputDto>;
}

export const API_COLLECT_OUTBOUND_PORT = 'API_COLLECT_OUTBOUND_PORT' as const;
