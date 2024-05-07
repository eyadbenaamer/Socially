import { useDispatch, useSelector } from "react-redux";

import { toggleTheme } from "state";

import { ReactComponent as MoonIcon } from "assets/icons/moon.svg";

const ToggleTheme = () => {
  const theme = useSelector((state) => state.settings).theme;
  const dispatch = useDispatch();
  return (
    <MoonIcon
      onClick={() => dispatch(toggleTheme())}
      style={{
        display: "inline",
        marginRight: 10,
        transform: "translateX(1px)",
      }}
      width={16}
      fill={theme === "dark" ? "#daa520" : "#5b5d67"}
    />
  );
};
export default ToggleTheme;
