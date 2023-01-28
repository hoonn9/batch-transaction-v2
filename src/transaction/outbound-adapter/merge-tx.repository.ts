import { MergeTransactionEntity } from '../entity/merge-transaction.entity';
import { Inject, Injectable } from '@nestjs/common';
import { NodeJsonDbService } from '../../database/node-json-db/node-json-db.service';
import {
  MergeTransactionRaw,
  MergeTxFindOptions,
  MergeTxPaginationInput,
} from './type/merge-tx-repository.type';

export const MERGE_TRANSACTION_DATABASE_SERVICE =
  'MERGE_TRANSACTION_DATABASE_SERVICE' as const;

@Injectable()
export class MergeTxRepository {
  constructor(
    @Inject(MERGE_TRANSACTION_DATABASE_SERVICE)
    private readonly databaseService: NodeJsonDbService<MergeTransactionRaw>,
  ) {}

  async save(
    entities: MergeTransactionEntity | MergeTransactionEntity[],
  ): Promise<void> {
    if (Array.isArray(entities)) {
      await this.databaseService.save(
        entities.map(this.toRaw),
        'transactionId',
      );
    } else {
      await this.databaseService.save(this.toRaw(entities), 'transactionId');
    }
  }

  async findByTxId(
    transactionId: string,
  ): Promise<MergeTransactionEntity | undefined> {
    const raw = await this.databaseService.get<MergeTransactionRaw>(
      `/${transactionId}`,
    );

    if (!raw) {
      return;
    }
    return this.toEntity(raw);
  }

  async findMany(
    pagination: MergeTxPaginationInput,
    options: MergeTxFindOptions,
  ) {
    const result = {
      entities: [] as MergeTransactionEntity[],
      pageInfo: {
        totalPage: 0,
      },
    };

    const rawsObject = await this.databaseService.get<
      Record<string, MergeTransactionRaw>
    >('');

    if (rawsObject) {
      const allRaws = Object.values(rawsObject);
      const appliedOptionRaws = this.applyFindOption(allRaws, options);
      result.entities = this.applyPagination(appliedOptionRaws, pagination).map(
        this.toEntity,
      );

      result.pageInfo.totalPage = Math.ceil(
        appliedOptionRaws.length / pagination.size,
      );
    }
    return result;
  }

  private applyFindOption(
    raws: MergeTransactionRaw[],
    options: MergeTxFindOptions,
  ) {
    return raws.filter((raw) => {
      if (
        options.dateRange.startDate &&
        new Date(options.dateRange.startDate) > new Date(raw.date)
      ) {
        return false;
      }

      if (
        options.dateRange.endDate &&
        new Date(options.dateRange.endDate) < new Date(raw.date)
      ) {
        return false;
      }

      return true;
    });
  }

  private applyPagination(
    raws: MergeTransactionRaw[],
    pagination: MergeTxPaginationInput,
  ) {
    return raws.slice(
      (pagination.page - 1) * pagination.size,
      pagination.page * pagination.size,
    );
  }

  private toRaw(entity: MergeTransactionEntity): MergeTransactionRaw {
    return {
      transactionId: entity.transactionId,
      storeId: entity.storeId,
      productId: entity.productId,
      date: entity.date.toISOString(),
      balance: entity.balance,
      amount: entity.amount,
      cancelYn: entity.cancelYn,
    };
  }

  private toEntity(raw: MergeTransactionRaw) {
    const entity = new MergeTransactionEntity();
    entity.transactionId = raw.transactionId;
    entity.storeId = raw.storeId;
    entity.productId = raw.productId;
    entity.amount = raw.amount;
    entity.date = new Date(raw.date);
    entity.balance = raw.balance;
    entity.cancelYn = raw.cancelYn;
    return entity;
  }
}
