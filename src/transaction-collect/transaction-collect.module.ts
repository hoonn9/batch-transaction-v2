import { Module, Provider } from '@nestjs/common';
import { MERGE_TX_INBOUND_PORT } from '../transaction/inbound-port/merge-tx.inbound-port';
import { MergeTxService } from '../transaction/service/merge-tx.service';
import { COLLECT_STORE_TX_INBOUND_PORT } from './inbound-port/collect-store-tx.inbound-port';
import { CollectStoreTxService } from './service/collect-store-tx.service';
import { MERGE_TX_OUTBOUND_PORT } from '../transaction/outbound-port/merge-tx.outbound-port';
import { MergeTxAdapter } from '../transaction/outbound-adapter/merge-tx.adapter';
import { FETCH_STORE_TX_OUTBOUND_PORT } from './outbound-port/fetch-store-tx.outbound-port';
import { FetchStoreTxAdapter } from './outbound-adapter/fetch-store-tx.adapter';
import { FetchModule } from '../fetch/fetch.module';

const inboundPorts: Provider[] = [
  {
    provide: MERGE_TX_INBOUND_PORT,
    useClass: MergeTxService,
  },
  {
    provide: COLLECT_STORE_TX_INBOUND_PORT,
    useClass: CollectStoreTxService,
  },
];

const outboundPorts: Provider[] = [
  {
    provide: MERGE_TX_OUTBOUND_PORT,
    useClass: MergeTxAdapter,
  },
  {
    provide: FETCH_STORE_TX_OUTBOUND_PORT,
    useClass: FetchStoreTxAdapter,
  },
];

@Module({
  imports: [FetchModule],
  providers: [...inboundPorts, ...outboundPorts],
  exports: [...inboundPorts, ...outboundPorts],
})
export class TransactionCollectModule {}
