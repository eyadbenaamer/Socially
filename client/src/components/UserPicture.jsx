import React from "react";
import { Link } from "react-router-dom";

const UserPicture = (props) => {
  const { id, src, name } = props;
  const API_URL = process.env.REACT_APP_API_URL;
  return (
    <Link to={`/profile/${id}`} className="circle w-12 shadow-md">
      <img src={src} alt={name} />
    </Link>
  );
};

export default UserPicture;
