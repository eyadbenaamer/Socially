import { useEffect, useState } from "react";

const useGetTime = (createdAt) => {
  const [time, setTime] = useState("");
  let updateInterval =
    Date.now() - createdAt > 60000
      ? 60000
      : Date.now() - createdAt > 3600000
      ? 3600000
      : 1000;
  const updateTime = () => {
    let interval = Date.now() - createdAt;
    if (interval > 3600000) {
      interval = Math.floor(interval / 3600000);
      if (interval < 24) {
        setTime(`${interval}h`);
      } else if (interval >= 24) {
        // clearInterval()
        interval = Math.floor(interval / 24);
        if (interval < 7) {
          let postedDay =
            new Date(createdAt).getMonth() !== new Date().getMonth()
              ? new Date(createdAt).getDate() - 30
              : new Date(createdAt).getDate();
          setTime(`${new Date().getDate() - postedDay}d`);
        } else {
          setTime(`${new Date().toDateString(createdAt)}`);
        }
      }
    } else {
      interval = Math.floor(interval / 60000);
      if (interval < 1) {
        setTime("just now");
      } else {
        setTime(`${interval}m`);
      }
    }
  };
  useEffect(() => {
    updateTime();
    setInterval(updateTime, updateInterval);
  }, []);
  return time;
};

export default useGetTime;
