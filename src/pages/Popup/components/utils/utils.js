export const generateTimeOptions = (type = 'hour') => {
  return Array(59)
    .fill(null)
    .map((e, i) => {
      return {
        value: i,
        label: `${i} ${type}${i === 1 ? '' : 's'}`,
      };
    });
};
