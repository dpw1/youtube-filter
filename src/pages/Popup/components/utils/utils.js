export const generateTimeOptions = (type = 'hour') => {
  return Array(60)
    .fill(null)
    .map((e, i) => {
      return {
        value: i,
        label: `${i} ${type}${i === 1 ? '' : 's'}`,
      };
    });
};

export const minTwoDigits = (n) => {
  return (n < 10 ? '0' : '') + n;
};

export const convertToSeconds = (value) => {
  const split = value.split(':').reverse();
  let result = Number(split[0]) + Number(split[1] * 60);
  return split.length > 2 ? (result += Number(split[2] * 3600)) : result;
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
