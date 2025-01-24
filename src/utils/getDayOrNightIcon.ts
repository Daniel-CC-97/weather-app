export const getDayOrNightIcon = (iconname: string, dateTimeString: string) => {
  const hours = new Date(dateTimeString).getHours();
  const isDayTime = hours > 6 && hours < 18;
  return isDayTime ? iconname.replace(/.$/, "d") : iconname.replace(/.$/, "n");
};
