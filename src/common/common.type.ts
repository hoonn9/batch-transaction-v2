export type DateProps<T> = {
  [P in keyof T]: T[P] extends Date ? P : never;
}[keyof T];
