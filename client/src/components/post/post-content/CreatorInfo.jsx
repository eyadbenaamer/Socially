import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import useGetTime from "hooks/useGetTime";
import useFetchProfile from "hooks/useFetchUser";

const CreatorInfo = (props) => {
  const { creatorId, createdAt, location, postId } = props;
  const time = useGetTime(createdAt);
  const [profile] = useFetchProfile(creatorId);

  return (
    <>
      {profile && (
        <div className="flex gap-3">
          <UserPicture
            id={profile._id}
            src={profile.profilePicPath}
            name={`${profile.firstName} ${profile.lastName}`}
          />
          <div className="flex flex-col">
            <Link to={`/profile/${profile._id}`}>
              <span className=" hover:underline cursor-pointer">
                {profile.firstName} {profile.lastName}
              </span>
            </Link>
            <Link
              to={`/post/${profile._id}/${postId}`}
              className="flex gap-1 text-slate-400 text-xs hover:underline"
            >
              <span>{time}</span>
              {location && <span>in {location}</span>}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
export default CreatorInfo;
