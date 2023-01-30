import { IntersectionType } from '@nestjs/swagger';
import {
  DateRangeInputDto,
  PaginationInputDto,
} from '../../../common/common.dto';

export class GetBatchHistoriesQueryDto extends IntersectionType(
  PaginationInputDto,
  DateRangeInputDto,
) {}
