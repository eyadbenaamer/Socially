import React from "react";
import { Link } from "react-router-dom";

const UserPicture = (props) => {
  const { to, src, alt } = props;
  return (
    <Link to={to} className="circle w-12 shadow-md">
      <img src={src} alt={alt} />
    </Link>
  );
};

export default UserPicture;
