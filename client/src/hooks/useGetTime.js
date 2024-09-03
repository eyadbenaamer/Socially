import { useEffect, useState } from "react";

const useGetTime = (time) => {
  const [literalTime, setLiteralTime] = useState("");
  let updateInterval =
    Date.now() - time > 60000
      ? 60000
      : Date.now() - time > 3600000
      ? 3600000
      : 1000;
  const updateTime = () => {
    let interval = Date.now() - time;
    if (interval > 3600000) {
      interval = Math.floor(interval / 3600000);
      if (interval < 24) {
        setLiteralTime(`${interval}h`);
      } else if (interval >= 24) {
        // clearInterval()
        interval = Math.floor(interval / 24);
        if (interval < 7) {
          let postedDay =
            new Date(time).getMonth() !== new Date().getMonth()
              ? new Date(time).getDate() - 30
              : new Date(time).getDate();
          setLiteralTime(`${new Date().getDate() - postedDay}d`);
        } else {
          setLiteralTime(`${new Date(time).toDateString()}`);
        }
      }
    } else {
      interval = Math.floor(interval / 60000);
      if (interval < 1) {
        setLiteralTime("just now");
      } else {
        setLiteralTime(`${interval}m`);
      }
    }
  };
  useEffect(() => {
    updateTime();
    setInterval(updateTime, updateInterval);
    return () => clearInterval(updateTime);
  }, [time]);
  return literalTime;
};

export default useGetTime;
