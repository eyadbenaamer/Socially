import { useEffect, useState } from "react";

const Time = (props) => {
  const { date, withDate, forChat } = props;
  const [literalTime, setLiteralTime] = useState("");
  const getLiteralTime = () => {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth();
    const year = new Date(date).getFullYear();

    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    /*
    if the passed date is not today so the returned string will be 
    formatted by either if the passed date is at the same week or 
    the same year or not in the same year, so it will be like the following:
    at the same week: Sun 
    at the year:Oct 15  
    not at the same year:15/10/22  
    */
    const isToday =
      year === currentYear && month === currentMonth && day === currentDay;

    const isYesterday =
      year === currentYear && month === currentMonth && day === currentDay - 1;
    const isAtSameWeek =
      year === currentYear &&
      month === currentMonth &&
      day !== currentDay &&
      currentDay - day < 7;
    const isAtSameYear = year === currentYear;
    const isNotAtSameYear = year !== currentYear;

    /*
    if the passed date is today or the wanted value is 
    just the time then return the time only
    */
    if (!withDate || isToday) {
      if (forChat) {
        setLiteralTime("Today");
        return;
      }
      let time = new Date(date).toLocaleString("default", {
        hourCycle: "h24",
        hour: "2-digit",
        minute: "2-digit",
      });
      if (time.startsWith("24")) {
        time = time.replace("24", "00");
      }
      setLiteralTime(time);
      return;
    }
    if (isYesterday) {
      setLiteralTime("Yesterday");
      return;
    }
    if (isAtSameWeek) {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = daysOfWeek[new Date(date).getDay()];
      setLiteralTime(dayName);
      return;
    }
    if (isAtSameYear) {
      const month = new Date(date).toLocaleString("default", {
        month: "short",
      });
      setLiteralTime(`${day} ${month}`);
      return;
    }
    if (isNotAtSameYear) {
      setLiteralTime(`${day}/${month}/${String(year).slice(2, 4)}`);
      return;
    }
  };

  useEffect(() => {
    if (date) {
      getLiteralTime();
    } else {
      setLiteralTime("");
    }
  }, [date]);

  return <div className="text-xs whitespace-nowrap">{literalTime}</div>;
};

export default Time;
