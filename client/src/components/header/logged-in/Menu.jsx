import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as DropDownIcon } from "../../../assets/icons/drop-down.svg";
import { useRef, useState } from "react";
import ToggleTheme from "components/ToggleTheme";
import { logout, setLogin, setSettings } from "state";
import useHover from "hooks/useHover";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/icons/settings.svg";
import useCloseWidget from "hooks/useCloseWidget";
import { Navigate } from "react-router-dom";
const Menu = () => {
  const mode = useSelector((state) => state.settings.mode);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const menu = useRef(null);
  useCloseWidget(menu, setShowMenu);
  return (
    <div
      className="cursor-pointer relative flex justify-center w-10"
      onClick={() => {
        setShowMenu(!showMenu);
      }}
    >
      <DropDownIcon className="icon hovered" />
      {showMenu && (
        <div
          ref={menu}
          className="menu bg-300 cursor-pointer absolute right-0 radius w-max"
        >
          <ul className="flex flex-col radius">
            <li className="icon py-2 px-3 radius gap-3 bg-hovered text-hovered ">
              <SettingsIcon
                width={16}
                style={{ display: "inline", marginRight: 10 }}
              />
              Settings
            </li>
            <li
              onClick={() => {
                mode === "dark"
                  ? dispatch(setSettings({ property: "mode", value: "light" }))
                  : dispatch(setSettings({ property: "mode", value: "dark" }));
              }}
              className=" py-2 px-3 radius gap-3 bg-hovered text-hovered"
            >
              <ToggleTheme />
              Mode
            </li>
            <li
              className="icon  py-2 px-3 radius gap-3 bg-hovered text-hovered"
              onClick={() => {
                dispatch(logout());
              }}
            >
              <LogoutIcon
                width={16}
                style={{ display: "inline", marginRight: 10, marginLeft: -1 }}
              />
              Log out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
