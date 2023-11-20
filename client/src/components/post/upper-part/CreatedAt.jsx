import { useEffect, useState } from "react";

const CreatedAt = ({ createdAt }) => {
  const [time, setTime] = useState("");
  let interval = 0;
  let updateInterval = 1000;
  const updateTime = () => {
    interval = Date.now() - createdAt;
    if (interval > 3600000) {
      interval = Math.floor(interval / 3600000);
      if (interval < 24) {
        updateInterval = 3600000;
        setTime(`${interval}h`);
      } else if (interval >= 24) {
        // clearInterval()
        interval = Math.floor(interval / 24);
        if (interval < 7) {
          setTime(`${interval}d`);
        } else {
          setTime(`${new Date().toDateString(createdAt)}`);
        }
      }
    } else {
      interval = Math.floor(interval / 60000);
      if (interval < 1) {
        setTime("just now");
      } else {
        updateInterval = 60000;
        setTime(`${interval}m`);
      }
    }
  };
  useEffect(updateTime, []);
  setInterval(updateTime, updateInterval);
  return <span>{time}</span>;
};

export default CreatedAt;
