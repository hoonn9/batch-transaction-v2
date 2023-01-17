import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.interface';
import { JsonDB } from 'node-json-db';

@Injectable()
export class NodeJsonDbService<T> implements DatabaseService<T> {
  constructor(private readonly db: JsonDB, private readonly path: string) {}

  async save(entities: T[] | T): Promise<void> {
    await this.push(entities);
    await this.db.save();
  }

  private async push(entities: T | T[]): Promise<void> {
    if (Array.isArray(entities)) {
      await Promise.all(
        entities.map((entity) => this.db.push(`${this.path}[]`, entity, true)),
      );
    } else {
      await this.db.push(`${this.path}[]`, entities, true);
    }
  }
}
