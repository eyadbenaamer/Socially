import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import BarItem from "./BarItem";

import { ReactComponent as HomeIcon } from "assets/icons/home.svg";
import { ReactComponent as NotificationsIcon } from "assets/icons/notifications.svg";
import { ReactComponent as MessagesIcon } from "assets/icons/message-text.svg";
import { ReactComponent as SavedPostsIcon } from "assets/icons/saved-posts.svg";

const Bar = () => {
  const profile = useSelector((state) => state.profile);
  const location = useLocation();
  return (
    <aside className="fixed bottom-0 bg-300 h-fit w-full z-10 border-t border-t-[#00000073] py-1">
      <ul className="flex gap-3 items-center px-2 w-full">
        <BarItem to={"/"}>
          <HomeIcon
            className={`icon ${
              location.pathname === "/" ? "primary-text" : ""
            }`}
          />
        </BarItem>

        <BarItem to={`/profile/${profile._id}`}>
          <span className="circle w-9">
            <img src={profile.avatarPath} />
          </span>
        </BarItem>

        <BarItem to={"/notifications"}>
          <NotificationsIcon
            className={`icon ${
              location.pathname === "/notifications" ? "primary-text" : ""
            }`}
          />
        </BarItem>

        <BarItem to={"/messages"}>
          <MessagesIcon
            className={`icon ${
              location.pathname === "/messages" ? "primary-text" : ""
            }`}
          />
        </BarItem>

        <BarItem to={"/saved-posts"}>
          <SavedPostsIcon
            className={`icon ${
              location.pathname === "/saved-posts" ? "primary-text" : ""
            }`}
          />
        </BarItem>
      </ul>
    </aside>
  );
};

export default Bar;
