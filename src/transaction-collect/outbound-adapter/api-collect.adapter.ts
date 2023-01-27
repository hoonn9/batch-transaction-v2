import {
  ApiCollectOutboundPort,
  ApiCollectOutboundPortInputDto,
  ApiCollectOutboundPortOutputDto,
} from '../outbound-port/api-collect.outbound-port';
import { FetchService } from '../../fetch/fetch.service';
import { ApiCollectTransactionResponseDto } from './dto/api-collect.dto';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { CollectTransactionDto } from '../outbound-port/dto/collect-transaction.dto';
import { isFulfilledResult, isRejectedResult } from '../../lib/promise';

class GetTransactionFetchError extends Error {
  constructor(public readonly page: number) {
    super();
  }
}

@Injectable()
export class ApiCollectAdapter implements ApiCollectOutboundPort {
  private readonly API_PAGE_UNIT = 10;
  constructor(private readonly fetchService: FetchService) {}

  async execute(
    params: ApiCollectOutboundPortInputDto,
  ): Promise<ApiCollectOutboundPortOutputDto> {
    const totalPage = await this.getTxsByPage(1, 5);

    if (
      totalPage.pageInfo.totalPage * this.API_PAGE_UNIT <
      params.page * params.size
    ) {
      return null;
    }

    const needPageSize = params.size / this.API_PAGE_UNIT;

    const promises = Array.from({
      length: needPageSize,
    }).map(async (_, page) =>
      this.getTxsByPage(params.page * needPageSize + page + 1),
    );

    const allRes = await Promise.allSettled(promises);

    const txs: CollectTransactionDto[] = allRes
      .filter(isFulfilledResult)
      .reduce((prev, res) => {
        prev.push(...res.value.list);
        return prev;
      }, [] as CollectTransactionDto[]);

    const failedPages: number[] = [];

    allRes.filter(isRejectedResult).forEach((res) => {
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
  ): Promise<ApiCollectTransactionResponseDto> {
    try {
      const res = await this.fetchService.get<ApiCollectTransactionResponseDto>(
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

  async validateResponse(data: ApiCollectTransactionResponseDto) {
    const dto = plainToInstance(ApiCollectTransactionResponseDto, data);
    await validateOrReject(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    return dto;
  }
}
