import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FetchService } from './fetch.service';

@Module({
  imports: [HttpModule],
  providers: [FetchService],
  exports: [FetchService],
})
export class FetchModule {}
