export interface DatabaseService<T> {
  save(entities: T | T[]): Promise<void>;
}
