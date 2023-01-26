export const isFulfilledResult = <T>(
  res: PromiseSettledResult<T>,
): res is PromiseFulfilledResult<T> => res.status === 'fulfilled';

export const isRejectedResult = <T>(
  res: PromiseSettledResult<T>,
): res is PromiseRejectedResult => res.status === 'rejected';
