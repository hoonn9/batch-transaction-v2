export type ApiCollectInboundPortInputDto = void;
export type ApiCollectInboundPortOutputDto = void;

export interface ApiCollectInboundPort {
  execute(
    params: ApiCollectInboundPortInputDto,
  ): Promise<ApiCollectInboundPortOutputDto>;
}

export const API_COLLECT_INBOUND_PORT = 'API_COLLECT_INBOUND_PORT';
