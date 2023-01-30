import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FetchService } from './fetch.service';
import { FetchStatisticService } from './fetch-statistic.service';

@Module({
  imports: [HttpModule],
  providers: [FetchService, FetchStatisticService],
  exports: [FetchService, FetchStatisticService],
})
export class FetchModule {}
