import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);


export const formatTime = (time) => {
  if (!time) return "";

  return dayjs(time, "HH:mm:ss").format("h:mm A");
};


export const formatTimeRange = (start, end) => {
  if (!start || !end) return "";

  return `${formatTime(start)} - ${formatTime(end)}`;
};