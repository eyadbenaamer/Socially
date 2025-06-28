import { useContext, useState } from "react";

import { ProfileContext } from ".";

const CoverPicture = () => {
  const { coverPicPath, profilePicPath, username } = useContext(ProfileContext);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  return (
    <>
      <div
        className="cover-image-container relative bg-200 h-[150px] sm:h-[250px] w-full overflow-hidden"
        style={{
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        {!coverLoaded && coverPicPath && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}
        {coverPicPath && (
          <img
            alt={username || "cover"}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              coverLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={coverPicPath}
            loading="lazy"
            onLoad={() => setCoverLoaded(true)}
          />
        )}
      </div>
      <div className="profile-image-container absolute -translate-y-[50%] translate-x-5 circle w-32 sm:w-36 border-2 bg-300">
        {!profileLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-full" />
        )}
        <img
          alt={username || "profile"}
          className={`h-full max-w-fit min-w-full object-cover circle transition-opacity duration-300 ${
            profileLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={profilePicPath}
          loading="lazy"
          onLoad={() => setProfileLoaded(true)}
        />
      </div>
    </>
  );
};

export default CoverPicture;
