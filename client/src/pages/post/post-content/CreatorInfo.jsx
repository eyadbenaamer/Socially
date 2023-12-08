import UserPicture from "components/UserPicture";
import React from "react";
import { Link } from "react-router-dom";
import useGetTime from "hooks/useGetTime";
import useFetchUser from "hooks/useFetchUser";

export const CreatorInfo = (props) => {
  const { creatorId, createdAt, location, postId } = props;
  const time = useGetTime(createdAt);
  const [user] = useFetchUser(creatorId);
  return (
    <>
      {user && (
        <div className="flex gap-3">
          <UserPicture
            id={user._id}
            src={user.picturePath}
            name={`${user.firstName} ${user.lastName}`}
          />
          <div className="flex flex-col">
            <Link to={`/profile/${user._id}`}>
              <span className=" hover:underline cursor-pointer">
                {user.firstName} {user.lastName}
              </span>
            </Link>
            <Link
              to={`/post/${user._id}/${postId}`}
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
