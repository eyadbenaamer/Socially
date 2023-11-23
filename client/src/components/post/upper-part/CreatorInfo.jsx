import UserPicture from "components/UserPicture";
import React from "react";
import { Link } from "react-router-dom";
import useGetTime from "hooks/useGetTime";

export const CreatorInfo = (props) => {
  const { user, createdAt, location, id } = props;
  const time = useGetTime(createdAt);

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
            <div className="flex gap-1 text-slate-400 text-xs">
              <span>{time}</span>
              {location && <span>in {location}</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
