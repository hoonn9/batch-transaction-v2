import { Injectable } from '@nestjs/common';
import { DataError, JsonDB } from 'node-json-db';

@Injectable()
export class NodeJsonDbService<T> {
  constructor(private readonly db: JsonDB, private readonly path: string) {}

  async get<T>(dataPath: string) {
    try {
      return await this.db.getObject<T>(this.path + dataPath);
    } catch (e) {
      if (e instanceof DataError) {
        return;
      }
      throw e;
    }
  }

  private async saveObject(key: string, entity: T) {
    await this.db.push(
      this.path,
      {
        [key]: entity,
      },
      false,
    );
    await this.db.save();
  }

  async save(entities: T[] | T, key: keyof T): Promise<void> {
    await this.push(entities, key);
    await this.db.save();
  }

  private async push(entities: T | T[], key: keyof T): Promise<void> {
    if (Array.isArray(entities)) {
      await Promise.all(
        entities.map((entity) =>
          this.saveObject(entity[key.toString()], entity),
        ),
      );
    } else {
      await this.db.push(entities[key.toString()], entities);
    }
  }

  async drop() {
    await this.db.delete(this.path);
  }
}
