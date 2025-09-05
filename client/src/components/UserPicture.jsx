import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HoverWrapper from "./user-hover-card/HoverWrapper";

const UserPicture = ({ profile, noLink = false, noCard }) => {
  const { _id: id, username, firstName, lastName, profilePicPath } = profile;

  const myProfile = useSelector((state) => state.profile);
  const contacts = useSelector((state) => state.contacts);
  const contact = contacts.find((contact) => contact._id === id);
  const isOnline = contact?.isOnline;

  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    if (!profilePicPath) return;

    const img = new Image();
    img.src = profilePicPath;

    img
      .decode()
      .then(() => setLoadedSrc(profilePicPath))
      .catch(() => setLoadedSrc(null));
  }, [profilePicPath]);

  const imageContent = (
    <>
      {loadedSrc ? (
        <img
          src={loadedSrc}
          alt={`${firstName} ${lastName}`}
          width={48}
          height={48}
          className="h-full w-full object-cover circle transition-opacity duration-200 ease-in"
        />
      ) : (
        <div
          className="h-full w-full bg-gray-300 animate-pulse rounded-full"
          style={{ width: 48, height: 48 }}
        />
      )}
    </>
  );

  return (
    <HoverWrapper noCard={noCard} profile={profile}>
      <div className="relative">
        {noLink ? (
          <div className="circle shadow-md border-2 block">{imageContent}</div>
        ) : (
          <Link
            to={`/profile/${username}`}
            className="circle shadow-md border-2 block"
          >
            {imageContent}
          </Link>
        )}
        {(isOnline || (myProfile?._id === id && !noLink)) && (
          <div className="green-dot h-3 w-3 circle bg-green-700 absolute left-0 bottom-0.5"></div>
        )}
      </div>
    </HoverWrapper>
  );
};

export default UserPicture;
