import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { NodeJsonDbService } from './node-json-db.service';

export type NodeJsonDbEntity = {
  path: string;
  token: any;
};

@Module({})
export class NodeJsonDbModule {
  static register(entities: NodeJsonDbEntity[]): DynamicModule {
    const db = new JsonDB(new Config('my-db', false, false));

    const providers = entities.map((entity): Provider => {
      return {
        provide: entity.token,
        useFactory: () => {
          return new NodeJsonDbService(db, entity.path);
        },
      };
    });

    return {
      module: NodeJsonDbModule,
      providers: providers,
      exports: providers,
    };
  }
}
