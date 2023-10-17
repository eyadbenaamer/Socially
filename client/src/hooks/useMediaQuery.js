import { useState } from "react";
export const useMediaQuery = ({ maxWidth, minWidth }) => {
  let isLessThanMaxWidth = true,
    isGreaterThanMinWidth = true;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  window.onresize = () => {
    setWindowWidth(window.innerWidth);
  };
  if (maxWidth) {
    windowWidth <= maxWidth
      ? (isLessThanMaxWidth = true)
      : (isLessThanMaxWidth = false);
  }
  if (minWidth) {
    windowWidth >= minWidth
      ? (isGreaterThanMinWidth = true)
      : (isGreaterThanMinWidth = false);
  }
  return isLessThanMaxWidth && isGreaterThanMinWidth;
};
