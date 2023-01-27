import { Injectable, Logger } from '@nestjs/common';
import {
  CsvCollectOutboundPort,
  CsvCollectOutboundPortInputDto,
  CsvCollectOutboundPortOutputDto,
} from '../outbound-port/csv-collect.outbound-port';
import { createReadStream } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { parse } from 'csv-parse';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CollectTransactionDto } from '../outbound-port/dto/collect-transaction.dto';

@Injectable()
export class CsvCollectAdapter implements CsvCollectOutboundPort {
  async execute(
    params: CsvCollectOutboundPortInputDto,
  ): Promise<CsvCollectOutboundPortOutputDto> {
    const raws = await new Promise<CollectTransactionDto[]>(
      (resolve, reject) => {
        const path = join(cwd(), 'transaction.csv');
        const raws: CollectTransactionDto[] = [];
        const startRaw = (params.page - 1) * params.size + 1;
        createReadStream(path)
          .pipe(
            parse({
              delimiter: ',',
              from_line: startRaw === 1 ? 2 : startRaw,
              to_line: params.page * params.size,
            }),
          )
          .on('error', (err) => {
            reject(err);
          })
          .on('data', (records: string[]) => {
            const dto = this.fromRecord(records);
            if (dto) {
              raws.push(dto);
            }
          })
          .on('end', () => {
            resolve(raws);
          });
      },
    );

    if (!raws) {
      return null;
    }

    return await this.filterValidEntities(raws);
  }

  private fromRecord(records: string[]): CollectTransactionDto | null {
    if (records.length !== 6) {
      Logger.error('transaction raw read is invalid format.');
      return null;
    }

    const [amount, balance, cancelYn, date, storeId, transactionId] = records;

    return {
      transactionId,
      storeId,
      amount: +amount,
      balance: +balance,
      cancelYn: cancelYn as 'Y' | 'N',
      date,
    };
  }

  private async filterValidEntities(
    collectTxs: CollectTransactionDto[],
  ): Promise<CollectTransactionDto[]> {
    const result: CollectTransactionDto[] = [];
    await Promise.allSettled(
      collectTxs.map(async (dto) => {
        try {
          await this.validate(dto);
          result.push(dto);
        } catch (e) {
          if (Array.isArray(e) && e.length && e[0] instanceof ValidationError) {
            Logger.error('transaction raw read is invalid format.', e);
          }
          throw e;
        }
      }),
    );

    return result;
  }

  private async validate(plain: Record<any, any>): Promise<void> {
    const dto = plainToInstance(CollectTransactionDto, plain);
    await validateOrReject(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
  }
}
