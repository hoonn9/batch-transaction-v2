import { MergeTxPaginationInput } from '../transaction/outbound-adapter/type/merge-tx-repository.type';
import { DateProps } from './common.type';
import { DateRangeOption } from './common-repository.type';

export class CommonRepository<T> {
  applyDateRange<T extends Record<K, Date>, K extends DateProps<T>>(
    raws: T[],
    key: K,
    dateRange: DateRangeOption,
  ) {
    return raws.filter((raw) => {
      if (dateRange.startDate && dateRange.startDate > new Date(raw[key])) {
        return false;
      }

      if (dateRange.endDate && dateRange.endDate < new Date(raw[key])) {
        return false;
      }

      return true;
    });
  }

  applyPagination(raws: T[], pagination: MergeTxPaginationInput) {
    return raws.slice(
      (pagination.page - 1) * pagination.size,
      pagination.page * pagination.size,
    );
  }
}
