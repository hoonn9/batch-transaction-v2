import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { NodeJsonDbService } from './node-json-db.service';
import { MERGE_TRANSACTION_DATABASE_SERVICE } from '../../transaction/outbound-adapter/merge-tx.repository';
import { BATCH_HISTORY_DATABASE_SERVICE } from '../../batch/outbound-adapter/batch-history.repository';
import { MERGE_TX_BATCH_HISTORY_DATABASE_SERVICE } from '../../batch/merge-tx/merge-tx-batch-history/outbound-adapter/merge-tx-batch-history.repository';

const makeProviders = (db): Provider[] => [
  {
    provide: MERGE_TRANSACTION_DATABASE_SERVICE,
    useValue: new NodeJsonDbService(db, '/mergeTxs'),
  },
  {
    provide: BATCH_HISTORY_DATABASE_SERVICE,
    useValue: new NodeJsonDbService(db, '/batchHistories'),
  },
  {
    provide: MERGE_TX_BATCH_HISTORY_DATABASE_SERVICE,
    useValue: new NodeJsonDbService(db, '/mergeTxBatchHistories'),
  },
];

@Module({})
export class NodeJsonDbModule {
  static register(filename: string): DynamicModule {
    const db = new JsonDB(new Config(filename, false, false));
    const providers = makeProviders(db);

    return {
      module: NodeJsonDbModule,
      providers: providers,
      exports: providers,
    };
  }
}
