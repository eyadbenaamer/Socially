// TODO: fix media queries for height
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { ReactComponent as HomeIcon } from "assets/icons/home.svg";
import { ReactComponent as NotificationsIcon } from "assets/icons/notifications.svg";
import { ReactComponent as MessagesIcon } from "assets/icons/message-text.svg";
import { ReactComponent as SavedPostsIcon } from "assets/icons/saved-posts.svg";

import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const profile = useSelector((state) => state.profile);
  const location = useLocation();

  const unreadMessagesCount = useSelector((state) => state.unreadMessagesCount);
  const unreadNotificationsCount = useSelector(
    (state) => state.unreadNotificationsCount
  );

  return (
    <aside className="fixed">
      <ul className="flex flex-col gap-3 items-start px-2 w-full">
        <SidebarItem to={"/"} name={"Home"}>
          <HomeIcon
            className={`${location.pathname === "/" ? "text-primary" : ""}`}
          />
        </SidebarItem>
        <SidebarItem
          to={`/profile/${profile.username}`}
          name={`${profile.firstName} ${profile.lastName}`}
        >
          <span className="circle w-9 border-2">
            <img className="h-full w-full" src={profile.profilePicPath} />
          </span>
        </SidebarItem>

        <SidebarItem to={"/notifications"} name={"Notifications"}>
          <div className="relative">
            <NotificationsIcon
              className={`${
                location.pathname === "/notifications" ? "text-primary" : ""
              }`}
            />
            {unreadNotificationsCount > 0 ? (
              <div className="absolute bottom-0 -right-2 circle w-5 h-5 p-[1px] bg-red-500 text-white text-[10px]">
                {unreadNotificationsCount > 99
                  ? "99+"
                  : unreadNotificationsCount}
              </div>
            ) : null}
          </div>
        </SidebarItem>

        <SidebarItem to={"/messages"} name={"Messages"}>
          <div className="relative">
            <MessagesIcon
              className={`${
                location.pathname.startsWith("/messages") ? "text-primary" : ""
              }`}
            />
            {unreadMessagesCount > 0 ? (
              <div className="absolute bottom-0 -right-2 circle w-5 h-5 p-[1px] bg-red-500 text-white text-[10px]">
                {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
              </div>
            ) : null}
          </div>
        </SidebarItem>

        <SidebarItem to={"/saved-posts"} name={"Saved Posts"}>
          <SavedPostsIcon
            className={`${
              location.pathname === "/saved-posts" ? "text-primary" : ""
            }`}
          />
        </SidebarItem>
      </ul>
    </aside>
  );
};

export default Sidebar;
