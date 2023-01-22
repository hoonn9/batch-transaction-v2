import {
  ApiCollectOutboundPort,
  ApiCollectOutboundPortInputDto,
  ApiCollectOutboundPortOutputDto,
} from '../outbound-port/api-collect.outbound-port';
import { FetchService } from '../../fetch/fetch.service';
import {
  CollectTransactionDto,
  CollectTransactionResponseDto,
} from './dto/api-collect-transaction.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiCollectFetchAdapter implements ApiCollectOutboundPort {
  constructor(private readonly fetchService: FetchService) {}

  async execute(
    params: ApiCollectOutboundPortInputDto,
  ): Promise<ApiCollectOutboundPortOutputDto> {
    const result: CollectTransactionDto[] = [];

    const firstRes = await this.getTxsByPage(1);
    console.log('firstRes', firstRes);
    result.push(...firstRes.transactions);

    const promises = Array.from({
      length: firstRes.pageInfo.totalPage - 1,
    }).map(async (_, page) => this.getTxsByPage(page + 2));

    const allRes = await Promise.allSettled(promises);

    allRes.forEach((res) => {
      if (res.status === 'fulfilled') {
        result.push(...res.value.transactions);
      }
    });

    return {
      transactions: result,
    };
  }

  async getTxsByPage(page: number): Promise<CollectTransactionResponseDto> {
    const res = await this.fetchService.get<CollectTransactionResponseDto>(
      'http://localhost:4001/transaction',
      {
        params: {
          page,
        },
      },
    );

    return res.data;
  }
}
