import useFetchProfile from "hooks/useFetchProfile";
import UserPicture from "../UserPicture";

const Contact = (props) => {
  const { id, isOnline } = props;
  const [profile] = useFetchProfile(id);
  return (
    <div className="flex flex-col gap-2 items-center min-w-[70px]">
      {profile && <UserPicture profile={profile} isOnline={isOnline} />}
      {profile && (
        <div className="max-w-full text-xs overflow-hidden text-ellipsis">
          {profile.firstName}
        </div>
      )}
    </div>
  );
};

export default Contact;
