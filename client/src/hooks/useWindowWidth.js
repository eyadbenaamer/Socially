import { useState } from "react";
export const useWindowWidth = () => {
  let [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.onresize = () => {
    setWindowWidth(window.innerWidth);
  };
  return windowWidth;
};
