import { Module, Provider } from '@nestjs/common';
import { MERGE_TX_INBOUND_PORT } from './inbound-port/merge-tx.inbound-port';
import { MergeTxService } from './service/merge-tx.service';
import { MERGE_TX_OUTBOUND_PORT } from './outbound-port/merge-tx.outbound-port';
import { MergeTxAdapter } from './outbound-adapter/merge-tx.adapter';
import { SaveMergeTxService } from './service/save-merge-tx.service';
import { SAVE_MERGE_TX_INBOUND_PORT } from './inbound-port/save-merge-tx.inbound-port';
import { TransactionController } from './controller/transaction.controller';
import { NodeJsonDbModule } from '../database/node-json-db/node-json-db.module';
import {
  MERGE_TRANSACTION_DATABASE_SERVICE,
  MergeTxRepository,
} from './outbound-adapter/merge-tx.repository';

const mergeTxPorts: Provider[] = [
  {
    provide: MERGE_TX_INBOUND_PORT,
    useClass: MergeTxService,
  },
  {
    provide: MERGE_TX_OUTBOUND_PORT,
    useClass: MergeTxAdapter,
  },
];

const saveMergeTxPorts: Provider[] = [
  {
    provide: SAVE_MERGE_TX_INBOUND_PORT,
    useClass: SaveMergeTxService,
  },
  MergeTxRepository,
];

const saveMergeTxController = [TransactionController];

@Module({
  imports: [
    NodeJsonDbModule.register([
      {
        path: '/mergeTxs',
        token: MERGE_TRANSACTION_DATABASE_SERVICE,
      },
    ]),
  ],
  controllers: [...saveMergeTxController],
  providers: [...mergeTxPorts, ...saveMergeTxPorts],
})
export class TransactionModule {}
