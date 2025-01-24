export const convertWindSpeed = (speed: number): string => {
  const speedInKmph = speed * 3.6;
  return `${speedInKmph.toFixed(0)}km/h`;
};
