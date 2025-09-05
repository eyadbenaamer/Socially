import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Picture from "./Picture";
import OptionsBtn from "./options-btn";

import axiosClient from "utils/AxiosClient";
import Time from "components/time";

const Notification = (props) => {
  const { _id: id, path, engagedUser, type, isRead, createdAt } = props;
  const theme = useSelector((state) => state.settings.theme);

  const content = `${engagedUser?.firstName} ${
    type === "follow"
      ? "followed you"
      : type === "comment"
      ? "commented on your post"
      : type === "reply"
      ? "replied on your comment"
      : type === "share"
      ? "shared your post"
      : type === "postLike"
      ? "liked your post"
      : type === "commentLike"
      ? "liked your comment"
      : type === "replyLike"
      ? "liked your reply"
      : ""
  }`;

  return (
    <div className="flex gap-5 items-center bg-hovered rounded-lg transition p-2">
      <Link
        onClick={() => {
          if (!isRead) {
            axiosClient.patch(`notifications/set_read/${id}`).catch(() => {});
          }
        }}
        to={path}
        className="flex gap-3 items-center flex-grow"
      >
        <Picture profile={engagedUser} notificationType={type} />
        <div>
          <div className={`${!isRead ? "font-bold" : ""}`}>{content}</div>
          <div
            className={`flex w-full text-xs ${
              theme === "dark" ? "text-gray-500" : "text-gray-800"
            }`}
          >
            <Time date={createdAt} withDate />
          </div>
        </div>
        {!isRead && (
          <span className="unread-dot bg-primary circle w-2 h-2"></span>
        )}
      </Link>
      <OptionsBtn id={id} isRead={isRead} />
    </div>
  );
};

export default Notification;
