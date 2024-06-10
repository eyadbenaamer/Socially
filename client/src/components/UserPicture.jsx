import React from "react";
import { Link } from "react-router-dom";

const UserPicture = (props) => {
  const { username, firstName, lastName, profilePicPath } = props.profile;

  return (
    <Link
      to={`/profile/${username}`}
      className="circle w-12 shadow-md border-2"
    >
      <img
        className="h-full w-full"
        loading="lazy"
        src={profilePicPath}
        alt={`${firstName} ${lastName}`}
      />
    </Link>
  );
};

export default UserPicture;
