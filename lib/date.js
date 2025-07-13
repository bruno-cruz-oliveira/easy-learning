export const formatMyDate = date => {
  if (!date) return "Invalid Date";
  const parseDate = new Date(date);

  if (isNaN(parseDate)) return "Invalid Date";

  let options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(parseDate);
};

export const formatDuration = (duration) => {
  if (!duration) return null;

  let hour = Math.floor(duration / 3600);
  let min = Math.floor(duration % 3600 / 60);
  let sec = Math.floor(duration % 3600 % 60);

  const durationString = `${hour}:${min}:${sec}`;

  return durationString;
};