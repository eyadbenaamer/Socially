import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import useGetTime from "hooks/useGetTime";
import HoverWrapper from "components/user-hover-card/HoverWrapper";

const CreatorInfo = (props) => {
  const { profile, createdAt, location, postId } = props;
  const time = useGetTime(createdAt);

  if (!profile) {
    return (
      <div className="user-info w-fit flex gap-2">
        <div className="circle w-12 h-12 loading"></div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="h-2 loading rounded-xl w-[100px]"></div>
          <div className="h-2 loading rounded-xl w-[80px]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="w-12">
        <UserPicture profile={profile} />
      </span>
      <div className="flex flex-col">
        <HoverWrapper profile={profile}>
          <Link to={`/profile/${profile.username}`}>
            <span className=" hover:underline cursor-pointer">
              {profile.firstName} {profile.lastName}
            </span>
          </Link>
        </HoverWrapper>
        <Link
          to={`/post?_id=${postId}`}
          className="flex gap-1 text-slate-400 text-xs hover:underline"
        >
          <span>{time}</span>
          {location && <span>in {location}</span>}
        </Link>
      </div>
    </div>
  );
};
export default CreatorInfo;
