import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Picture from "./Picture";
import OptionsBtn from "./options-btn";

import axiosClient from "utils/AxiosClient";
import Time from "components/time";

const Notification = (props) => {
  const { _id: id, url, content, picture, type, isRead, createdAt } = props;
  const theme = useSelector((state) => state.settings.theme);

  return (
    <div className="flex gap-5 items-center bg-hovered rounded-lg transition p-2">
      <Link
        onClick={() => {
          if (!isRead) {
            axiosClient.patch(`notifications/set_read/${id}`);
          }
        }}
        to={url}
        className="flex gap-3 items-center flex-grow"
      >
        <Picture picture={picture} notificationType={type} />
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
