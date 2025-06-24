import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import UserPicture from "../UserPicture";

import useFetchProfile from "hooks/useFetchProfile";

const Contact = (props) => {
  const { id, isOnline } = props;

  const [profile] = useFetchProfile(id);

  const contact = useSelector((state) => state.contacts).find(
    (con) => con._id === id
  );

  if (!profile) return null;

  return (
    <Link
      to={`contact/${contact?.conversationId}`}
      className="flex flex-col gap-2 items-center min-w-[70px]"
    >
      <UserPicture profile={profile} isOnline={isOnline} />
      <div className="max-w-full text-xs overflow-hidden text-ellipsis pb-2">
        {profile.firstName}
      </div>
    </Link>
  );
};

export default Contact;
