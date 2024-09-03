import { useEffect, useState } from "react";

const useGetTime = (time) => {
  const [literalTime, setLiteralTime] = useState("");

  const updateTime = () => {
    let interval = Date.now() - time;
    if (interval > 3600000) {
      interval = Math.floor(interval / 3600000);
      if (interval === 1) {
        setLiteralTime("an hour ago");
        return;
      }
      if (interval < 24) {
        setLiteralTime(`${interval} hours ago`);
        return;
      }
      if (interval >= 24) {
        interval = Math.floor(interval / 24);
        if (interval < 7) {
          let postedDay =
            new Date(time).getMonth() !== new Date().getMonth()
              ? new Date(time).getDate() - 30
              : new Date(time).getDate();
          const days = new Date().getDate() - postedDay;
          setLiteralTime(`${days} day${days > 1 ? "s" : ""} ago`);
          return;
        }
        if (interval >= 7 && interval < 30) {
          const weeksCount = Math.floor(interval / 7);
          setLiteralTime(
            `${weeksCount === 1 ? "week" : weeksCount + " weeks"} ago`
          );
          return;
        }
        if (interval >= 30 && interval < 60) {
          setLiteralTime("a month ago");
          return;
        } else {
          setLiteralTime("long time ago");
        }
      }
      return;
    }
    interval = Math.floor(interval / 60000);
    if (interval < 1) {
      setLiteralTime("just now");
    } else {
      setLiteralTime(
        `${interval} ${interval === 1 ? "minute" : "minutes"} ago`
      );
      return;
    }
  };

  useEffect(() => {
    if (time) {
      updateTime();
      const updater = setInterval(updateTime, 1000);
      return () => clearInterval(updater);
    } else {
      setLiteralTime("recently");
    }
  }, [time]);
  return literalTime;
};

export default useGetTime;
