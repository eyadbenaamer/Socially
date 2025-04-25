import useFetchProfile from "hooks/useFetchProfile";
import UserPicture from "../UserPicture";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Contact = (props) => {
  const { id, isOnline } = props;
  const [profile] = useFetchProfile(id);
  const contact = useSelector((state) => state.contacts).find(
    (con) => con._id === id
  );

  return (
    <Link
      to={contact?.conversationId}
      className="flex flex-col gap-2 items-center min-w-[70px]"
    >
      {profile && <UserPicture profile={profile} isOnline={isOnline} />}
      {profile && (
        <div className="max-w-full text-xs overflow-hidden text-ellipsis">
          {profile.firstName}
        </div>
      )}
    </Link>
  );
};

export default Contact;
