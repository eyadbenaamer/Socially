import { Link } from "react-router-dom";

import Picture from "./Picture";
import OptionsBtn from "./options-btn";

import axiosClient from "utils/AxiosClient";

const Notification = (props) => {
  const { _id: id, url, content, picture, type, isRead } = props;

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
        <span className={`${!isRead ? "font-bold" : ""}`}>{content}</span>
        {!isRead && (
          <span className="unread-dot bg-primary circle w-2 h-2"></span>
        )}
      </Link>
      <OptionsBtn id={id} isRead={isRead} />
    </div>
  );
};

export default Notification;
