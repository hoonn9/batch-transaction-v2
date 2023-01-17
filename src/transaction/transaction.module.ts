import { Module, Provider } from '@nestjs/common';
import { MERGE_TX_INBOUND_PORT } from './inbound-port/merge-tx.inbound-port';
import { MergeTxService } from './service/merge-tx.service';
import { MERGE_TX_OUTBOUND_PORT } from './outbound-port/merge-tx.outbound-port';
import { MergeTxRepository } from './outbound-adapter/merge-tx.repository';

const ports: Provider[] = [
  {
    provide: MERGE_TX_INBOUND_PORT,
    useClass: MergeTxService,
  },
  {
    provide: MERGE_TX_OUTBOUND_PORT,
    useClass: MergeTxRepository,
  },
];

@Module({
  controllers: [],
  providers: [...ports],
})
export class TransactionModule {}
