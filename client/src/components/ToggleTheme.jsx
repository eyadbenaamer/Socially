import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "state";
import { ReactComponent as MoonIcon } from "../assets/icons/moon.svg";
const ToggleTheme = () => {
  const mode = useSelector((state) => state.settings).mode;
  const dispatch = useDispatch();
  return (
    <MoonIcon
      onClick={() => {
        if (mode === "dark") {
          dispatch(setSettings({ property: "mode", value: "light" }));
        } else {
          dispatch(setSettings({ property: "mode", value: "dark" }));
        }
      }}
      style={{
        display: "inline",
        marginRight: 10,
        transform: "translateX(1px)",
      }}
      width={16}
      fill={mode === "dark" ? "#daa520" : "#5b5d67"}
    />
  );
};
export default ToggleTheme;
