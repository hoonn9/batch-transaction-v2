import {
  DateRangeInputDto,
  PaginationInputDto,
} from '../../../common/common.dto';
import { IntersectionType } from '@nestjs/swagger';

export class GetMergeTxsQueryDto extends IntersectionType(
  PaginationInputDto,
  DateRangeInputDto,
) {}
