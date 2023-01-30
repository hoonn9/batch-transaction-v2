import { Module, Provider } from '@nestjs/common';
import { SAVE_MERGE_TX_BATCH_HISTORY_INBOUND_PORT } from './inbound-port/save-merge-tx-batch-history.inbound-port';
import { SaveMergeTxBatchHistoryService } from './service/save-merge-tx-batch-history.service';
import { SAVE_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT } from './outbound-port/save-merge-tx-batch-history.outbound-port';
import { SaveMergeTxBatchHistoryAdapter } from './outbound-adapter/save-merge-tx-batch-history.adapter';
import { MergeTxBatchHistoryRepository } from './outbound-adapter/merge-tx-batch-history.repository';
import { NodeJsonDbModule } from '../../../database/node-json-db/node-json-db.module';
import { FIND_MERGE_TX_INBOUND_PORT } from '../../../transaction/inbound-port/find-merge-tx.inbound-port';
import { FIND_MERGE_TX_BATCH_HISTORY_INBOUND_PORT } from './inbound-port/find-merge-tx-batch-history.inbound-port';
import { FindMergeTxBatchHistoryService } from './service/find-merge-tx-batch-history.service';
import { FIND_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT } from './outbound-port/find-merge-tx-batch-history.outbound-port';
import { FindMergeTxBatchHistoryAdapter } from './outbound-adapter/find-merge-tx-batch-history.adapter';

const inboundPorts: Provider[] = [
  {
    provide: SAVE_MERGE_TX_BATCH_HISTORY_INBOUND_PORT,
    useClass: SaveMergeTxBatchHistoryService,
  },
  {
    provide: FIND_MERGE_TX_BATCH_HISTORY_INBOUND_PORT,
    useClass: FindMergeTxBatchHistoryService,
  },
];

const outboundPorts: Provider[] = [
  {
    provide: SAVE_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT,
    useClass: SaveMergeTxBatchHistoryAdapter,
  },
  {
    provide: FIND_MERGE_TX_BATCH_HISTORY_OUTBOUND_PORT,
    useClass: FindMergeTxBatchHistoryAdapter,
  },
  MergeTxBatchHistoryRepository,
];

@Module({
  imports: [NodeJsonDbModule.register('my-db')],
  providers: [...inboundPorts, ...outboundPorts],
  exports: [...inboundPorts],
})
export class MergeTxBatchHistoryModule {}
