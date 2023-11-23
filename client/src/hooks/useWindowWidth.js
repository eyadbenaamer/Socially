import { useState } from "react";
export const useWindowWidth = () => {
  let [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
  });
  return windowWidth;
};
