import { useContext } from "react";

import { ProfileContext } from ".";

const CoverPicture = () => {
  const { coverPicPath, profilePicPath } = useContext(ProfileContext);

  return (
    <>
      <div
        className="cover-image-container relative bg-200 h-[150px] sm:h-[250px] w-full overflow-hidden"
        style={{
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        {coverPicPath && <div className="loading w-full h-full absolute"></div>}
        <img
          loading="lazy"
          className="max-h-full w-full"
          src={coverPicPath}
          // when the image is loaded remove the loading effect
          onLoad={() =>
            document.querySelector(".cover-image-container .loading").remove()
          }
        />
      </div>
      <div className="avatar-image-container absolute -translate-y-[50%] translate-x-5 circle w-32 sm:w-36 border-2 bg-300">
        <div className="loading w-full h-full">
          <img
            loading="lazy"
            className=" max-h-full w-full rounded-xl "
            src={profilePicPath}
          />
        </div>
      </div>
    </>
  );
};

export default CoverPicture;
