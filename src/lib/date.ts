export const yyyyMMdd = (date: Date) => {
  return date.toISOString().substring(0, 10);
};
