import { Inject, Injectable } from '@nestjs/common';
import {
  ApiCollectInboundPort,
  ApiCollectInboundPortInputDto,
  ApiCollectInboundPortOutputDto,
} from '../inbound-port/api-collect.inbound-port';
import {
  API_COLLECT_OUTBOUND_PORT,
  ApiCollectOutboundPort,
} from '../outbound-port/api-collect.outbound-port';

@Injectable()
export class ApiCollectService implements ApiCollectInboundPort {
  constructor(
    @Inject(API_COLLECT_OUTBOUND_PORT)
    private readonly apiCollectOutboundPort: ApiCollectOutboundPort,
  ) {}

  async execute(
    params: ApiCollectInboundPortInputDto,
  ): Promise<ApiCollectInboundPortOutputDto> {
    const result = await this.apiCollectOutboundPort.execute();
  }
}
