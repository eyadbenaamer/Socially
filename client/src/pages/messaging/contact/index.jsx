import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import UserPicture from "../UserPicture";

const Contact = (props) => {
  const { _id, isOnline, firstName } = props;

  const contact = useSelector((state) => state.contacts).find(
    (con) => con._id === _id
  );

  if (!_id) return null;

  return (
    <Link
      to={`contact/${contact?.conversationId}`}
      className="flex flex-col gap-2 items-center min-w-[70px]"
    >
      <UserPicture profile={props} isOnline={isOnline} />
      <div className="max-w-full text-xs overflow-hidden text-ellipsis pb-2">
        {firstName}
      </div>
    </Link>
  );
};

export default Contact;
