import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as NotificationsIcon } from "../../assets/icons/notifications.svg";
import { ReactComponent as MessagesIcon } from "../../assets/icons/message-text.svg";
import { ReactComponent as SavedPostsIcon } from "../../assets/icons/save.svg";
const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  return (
    <aside className="fixed">
      <ul className="flex flex-col gap-3 items-start px-2 w-full">
        <li className="w-full">
          <Link to={`/`}>
            <div className="icon bg-hovered text-hovered bg-hovered text-hovered flex gap-3 items-center  px-3 py-2 radius">
              <span className="w-9">
                <HomeIcon
                  className={`${location.pathname === "/" && "primary-text"}`}
                />
              </span>
              <span
                className={`${location.pathname === "/" && "primary-text"}`}
              >
                Home
              </span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link to={`/profile`}>
            <div className="icon bg-hovered text-hovered flex gap-3 items-center  px-3 py-2 radius">
              <span className="circle w-9">
                <img src={user.picturePath} />
              </span>
              <span>{`${user.firstName} ${user.lastName}`}</span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link to={`/notifications`}>
            <div className="icon bg-hovered text-hovered flex gap-3 items-center  px-3 py-2 radius">
              <span className=" w-9">
                <NotificationsIcon
                  className={`${
                    location.pathname === "/notifications" && "primary-text"
                  }`}
                />
              </span>
              <span
                className={`${
                  location.pathname === "/notifications" && "primary-text"
                }`}
              >
                Notifications
              </span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link to={`/messages`}>
            <div className="icon bg-hovered text-hovered flex gap-3 items-center  px-3 py-2 radius">
              <span className=" w-9">
                <MessagesIcon
                  className={`${
                    location.pathname === "/messages" && "primary-text"
                  }`}
                />
              </span>
              <span
                className={`${
                  location.pathname === "/messages" && "primary-text"
                }`}
              >
                Messages
              </span>
            </div>
          </Link>
        </li>
        <li className="w-full">
          <Link to={`/saved-posts`}>
            <div className="icon bg-hovered text-hovered flex gap-3 items-center  px-3 py-2 radius">
              <span className="flex items-center justify-center w-9">
                <SavedPostsIcon
                  className={`${
                    location.pathname === "/saved-posts" && "primary-text"
                  }`}
                />
              </span>
              <span
                className={`${
                  location.pathname === "/saved-posts" && "primary-text"
                }`}
              >
                Saved Posts
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
