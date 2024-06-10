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
              location.pathname === "/" ? "text-primary" : ""
            }`}
          />
        </BarItem>

        <BarItem to={`/profile/${profile.username}`}>
          <span className="circle w-9 border-[1px]">
            <img className="h-full w-full" src={profile.profilePicPath} />
          </span>
        </BarItem>

        <BarItem to={"/notifications"}>
          <NotificationsIcon
            className={`icon ${
              location.pathname === "/notifications" ? "text-primary" : ""
            }`}
          />
        </BarItem>

        <BarItem to={"/messages"}>
          <MessagesIcon
            className={`icon ${
              location.pathname === "/messages" ? "text-primary" : ""
            }`}
          />
        </BarItem>

        <BarItem to={"/saved-posts"}>
          <SavedPostsIcon
            className={`icon ${
              location.pathname === "/saved-posts" ? "text-primary" : ""
            }`}
          />
        </BarItem>
      </ul>
    </aside>
  );
};

export default Bar;
