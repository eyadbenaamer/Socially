import { useEffect, useState } from "react";

const useGetTime = (time) => {
  const [literalTime, setLiteralTime] = useState("");

  const updateTime = () => {
    let difference = Date.now() - time;

    if (difference > 3600000) {
      // if more than an hour
      difference = Math.floor(difference / 3600000);
      if (difference === 1) {
        setLiteralTime("an hour ago");
        return;
      }
      if (difference < 24) {
        setLiteralTime(`${difference} hours ago`);
        return;
      }
      if (difference >= 24) {
        difference = Math.floor(difference / 24);
        if (difference < 30) {
          setLiteralTime(
            `${difference === 1 ? "a day ago" : difference + " days"} ago`
          );
          return;
        }
        if (difference >= 30 && difference < 60) {
          setLiteralTime("within a month");
          return;
        } else {
          setLiteralTime("long time ago");
        }
      }
      return;
    }
    difference = Math.floor(difference / 60000);
    if (difference < 1) {
      setLiteralTime("just now");
    } else {
      setLiteralTime(
        `${difference} ${difference === 1 ? "minute" : "minutes"} ago`
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
