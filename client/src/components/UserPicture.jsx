import React from "react";
import { Link } from "react-router-dom";

const UserPicture = (props) => {
  const { id, src, name } = props;

  return (
    <Link to={`/profile/${id}`} className="circle w-12 shadow-md border-2">
      <img className="h-full w-full" loading="lazy" src={src} alt={name} />
    </Link>
  );
};

export default UserPicture;
