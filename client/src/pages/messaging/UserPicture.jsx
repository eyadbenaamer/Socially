import React from "react";

const UserPicture = (props) => {
  const { firstName, lastName, profilePicPath } = props.profile;
  const { isOnline } = props;

  return (
    <div className="relative h-fit">
      <div className="circle max-w-[3rem] shadow-md border-2">
        <img
          className="h-full w-full"
          loading="lazy"
          src={profilePicPath}
          alt={`${firstName} ${lastName}`}
        />
      </div>
      {isOnline && (
        <div className="green-dot h-2.5 w-2.5 circle bg-green-700 absolute left-1 bottom-0.5"></div>
      )}
    </div>
  );
};

export default UserPicture;
