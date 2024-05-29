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

  return (
    <aside className="fixed">
      <ul className="flex flex-col gap-3 items-start px-2 w-full">
        <SidebarItem to={"/"} name={"Home"}>
          <HomeIcon
            className={`${location.pathname === "/" ? "primary-text" : ""}`}
          />
        </SidebarItem>
        <SidebarItem
          to={`/profile/${profile._id}`}
          name={`${profile.firstName} ${profile.lastName}`}
        >
          <span className="circle w-9 border-2">
            <img src={profile.profilePicPath} />
          </span>
        </SidebarItem>

        <SidebarItem to={"/notifications"} name={"Notifications"}>
          <NotificationsIcon
            className={`${
              location.pathname === "/notifications" ? "primary-text" : ""
            }`}
          />
        </SidebarItem>

        <SidebarItem to={"/messages"} name={"Messages"}>
          <MessagesIcon
            className={`${
              location.pathname === "/messages" ? "primary-text" : ""
            }`}
          />
        </SidebarItem>

        <SidebarItem to={"/saved-posts"} name={"Saved Posts"}>
          <SavedPostsIcon
            className={`${
              location.pathname === "/saved-posts" ? "primary-text" : ""
            }`}
          />
        </SidebarItem>
      </ul>
    </aside>
  );
};

export default Sidebar;
