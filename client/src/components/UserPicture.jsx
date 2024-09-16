import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserPicture = (props) => {
  const {
    _id: id,
    username,
    firstName,
    lastName,
    profilePicPath,
  } = props.profile;
  const myProfile = useSelector((state) => state.profile);
  const contacts = useSelector((state) => state.contacts);
  const contact = contacts.find((contact) => contact._id === props.profile._id);
  const isOnline = contact?.isOnline;

  return (
    <div className="relative">
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
      {(isOnline || myProfile?._id === id) && (
        <div className="green-dot h-3 w-3 circle bg-green-700 absolute left-0 bottom-0.5"></div>
      )}
    </div>
  );
};

export default UserPicture;
