import { Test } from '@nestjs/testing';
import { ApiCollectFetchAdapter } from '../../../src/transaction-collect/outbound-adapter/api-collect-fetch.adapter';
import { FetchModule } from '../../../src/fetch/fetch.module';

describe('ApiCollectFetchAdapter', () => {
  let apiCollectFetchAdapter: ApiCollectFetchAdapter;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [FetchModule],
      providers: [ApiCollectFetchAdapter],
    }).compile();

    apiCollectFetchAdapter = app.get(ApiCollectFetchAdapter);
  });

  it('execute', async () => {
    const result = await apiCollectFetchAdapter.execute();
    console.log(result.transactions.length);
  });
});
