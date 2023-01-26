import { Injectable } from '@nestjs/common';
import {
  FetchStoreTxOutboundPort,
  FetchStoreTxOutboundPortInputDto,
  FetchStoreTxOutboundPortOutputDto,
} from '../outbound-port/fetch-store-tx.outbound-port';
import { FetchService } from '../../fetch/fetch.service';
import {
  FetchStoreTxDto,
  FetchStoreTxResponseDto,
} from './dto/fetch-store-tx.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { isFulfilledResult, isRejectedResult } from '../../lib/promise';
import { isAxiosError } from 'axios';

class StoreTxFetchError extends Error {
  constructor() {
    super();
  }
}

@Injectable()
export class FetchStoreTxAdapter implements FetchStoreTxOutboundPort {
  constructor(private readonly fetchService: FetchService) {}

  execute(
    params: FetchStoreTxOutboundPortInputDto,
  ): Promise<FetchStoreTxOutboundPortOutputDto> {
    return this.fetchAllPage(params.storeId, params.date);
  }

  private async fetchAllPage(storeId: string, date: string) {
    const pageInfo = await this.fetchPageInfo(storeId, date);

    if (pageInfo === null) {
      return [];
    }

    const promises = Array.from({ length: pageInfo.totalPage }).map((_, page) =>
      this.fetchStoreTxs(storeId, page + 1, date),
    );

    const allRes = await Promise.allSettled(promises);

    const storeTxs = allRes.filter(isFulfilledResult).reduce((prev, res) => {
      prev.push(...res.value.list);
      return prev;
    }, [] as FetchStoreTxDto[]);

    // const failed = allRes.filter(isRejectedResult).map((res) => res.reason);

    return storeTxs;
  }

  private async fetchPageInfo(storeId: string, date: string) {
    try {
      const result = await this.fetchStoreTxs(storeId, 1, date);
      return result.pageInfo;
    } catch (e) {
      return null;
    }
  }

  private async fetchStoreTxs(storeId: string, page: number, date: string) {
    try {
      const res = await this.fetchService.post<FetchStoreTxResponseDto>(
        `http://localhost:4002/store-transaction/${storeId}`,
        {
          page,
          date,
        },
      );
      return this.validateResponse(res.data);
    } catch (e) {
      if (isAxiosError(e)) {
        throw new StoreTxFetchError();
      }
      throw e;
    }
  }

  private async validateResponse(plain: FetchStoreTxResponseDto) {
    const dto = plainToInstance(FetchStoreTxResponseDto, plain);
    await validateOrReject(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    return dto;
  }
}
