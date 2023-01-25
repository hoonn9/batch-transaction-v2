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
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

class GetTransactionFetchError extends Error {
  constructor(public readonly page: number) {
    super();
  }
}

@Injectable()
export class ApiCollectFetchAdapter implements ApiCollectOutboundPort {
  constructor(private readonly fetchService: FetchService) {}

  async execute(
    params: ApiCollectOutboundPortInputDto,
  ): Promise<ApiCollectOutboundPortOutputDto> {
    const totalPage = await this.getTxsByPage(1, 5);

    const promises = Array.from({
      length: totalPage.pageInfo.totalPage,
    }).map(async (_, page) => this.getTxsByPage(page + 1));

    const allRes = await Promise.allSettled(promises);

    const txs: CollectTransactionDto[] = allRes
      .filter(
        (res): res is PromiseFulfilledResult<CollectTransactionResponseDto> =>
          res.status === 'fulfilled',
      )
      .reduce((prev, res) => {
        prev.push(...res.value.list);
        return prev;
      }, [] as CollectTransactionDto[]);

    const failedPages: number[] = [];

    allRes
      .filter((res): res is PromiseRejectedResult => res.status === 'rejected')
      .forEach((res) => {
        if (res.reason instanceof GetTransactionFetchError) {
          failedPages.push(res.reason.page);
        }

        if (res.reason instanceof ValidationError) {
          throw res.reason;
        }
      });

    return {
      transactions: txs,
      failedPages,
    };
  }

  async getTxsByPage(
    page: number,
    retryCnt = 0,
  ): Promise<CollectTransactionResponseDto> {
    try {
      const res = await this.fetchService.get<CollectTransactionResponseDto>(
        'http://localhost:4001/transaction',
        {
          params: {
            page,
          },
        },
        retryCnt,
      );
      return this.validateResponse(res.data);
    } catch (e) {
      throw new GetTransactionFetchError(page);
    }
  }

  async validateResponse(data: CollectTransactionResponseDto) {
    const dto = plainToInstance(CollectTransactionResponseDto, data);
    await validateOrReject(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    return dto;
  }
}
