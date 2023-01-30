import { Module, Provider } from '@nestjs/common';
import { MERGE_TX_INBOUND_PORT } from './inbound-port/merge-tx.inbound-port';
import { MergeTxService } from './service/merge-tx.service';
import { MERGE_TX_OUTBOUND_PORT } from './outbound-port/merge-tx.outbound-port';
import { MergeTxAdapter } from './outbound-adapter/merge-tx.adapter';
import { SaveMergeTxService } from './service/save-merge-tx.service';
import { SAVE_MERGE_TX_INBOUND_PORT } from './inbound-port/save-merge-tx.inbound-port';
import { TransactionController } from './controller/transaction.controller';
import { MergeTxRepository } from './outbound-adapter/merge-tx.repository';
import { FIND_MERGE_TX_INBOUND_PORT } from './inbound-port/find-merge-tx.inbound-port';
import { FindMergeTxService } from './service/find-merge-tx.service';
import { PAGINATION_MERGE_TX_INBOUND_PORT } from './inbound-port/pagination-merge-tx.inbound-port';
import { PaginationMergeTxService } from './service/pagination-merge-tx.service';
import { PAGINATION_MERGE_TX_OUTBOUND_PORT } from './outbound-port/pagination-merge-tx.outbound-port';
import { PaginationMergeTxAdapter } from './outbound-adapter/pagination-merge-tx.adapter';
import { NodeJsonDbModule } from '../database/node-json-db/node-json-db.module';

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

const findMergeTxPorts: Provider[] = [
  {
    provide: FIND_MERGE_TX_INBOUND_PORT,
    useClass: FindMergeTxService,
  },
];

const paginationMergeTxsPorts: Provider[] = [
  {
    provide: PAGINATION_MERGE_TX_INBOUND_PORT,
    useClass: PaginationMergeTxService,
  },
  {
    provide: PAGINATION_MERGE_TX_OUTBOUND_PORT,
    useClass: PaginationMergeTxAdapter,
  },
];

const saveMergeTxPorts: Provider[] = [
  {
    provide: SAVE_MERGE_TX_INBOUND_PORT,
    useClass: SaveMergeTxService,
  },
  MergeTxRepository,
];

@Module({
  imports: [NodeJsonDbModule.register('my-db')],
  controllers: [TransactionController],
  providers: [
    ...mergeTxPorts,
    ...findMergeTxPorts,
    ...saveMergeTxPorts,
    ...paginationMergeTxsPorts,
  ],
  exports: [
    MergeTxRepository,
    SAVE_MERGE_TX_INBOUND_PORT,
    FIND_MERGE_TX_INBOUND_PORT,
  ],
})
export class TransactionModule {}
