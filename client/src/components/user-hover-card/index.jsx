import { Link } from "react-router-dom";

import FollowToggleBtn from "components/FollowingBtn";

const UserHoverCard = (props) => {
  const { profile, mousePos, visible = true } = props;
  const {
    username,
    firstName,
    lastName,
    profilePicPath,
    coverPicPath,
    followers = 0,
    following = 0,
    bio,
  } = profile;
  // Determine vertical position only
  let style = {};
  if (mousePos.y < window.innerHeight / 2) {
    style.top = 40;
  } else {
    style.bottom = window.innerHeight - 40;
  }
  if (mousePos.x < window.innerWidth / 2) {
    style.left = -10;
  } else {
    style.right = -10;
  }

  return (
    <div
      className={`absolute z-[10000] w-80 rounded-md shadow-2xl bg-100 overflow-hidden transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={style}
    >
      {/* Cover Picture */}
      <div className="h-20 w-full bg-alt relative">
        {coverPicPath && (
          <img
            src={coverPicPath}
            alt="cover"
            className="w-full h-full object-cover"
          />
        )}
        {/* Profile Picture */}
        <div className="absolute left-4 -bottom-8 border circle bg-alt">
          <img
            loading="lazy"
            src={profilePicPath}
            alt={`${firstName} ${lastName}`}
            className="w-16 h-16 object-cover rounded-full"
          />
        </div>
      </div>
      <div className="pt-10 px-4">
        {/* Name and Username */}
        <div className="flex items-start justify-between">
          <div>
            <Link
              to={`/profile/${username}`}
              className="font-bold text-md block hover:underline"
            >
              {firstName} {lastName}
            </Link>
            <span className="text-gray-500 text-xs block mb-2">
              @{username}
            </span>
          </div>
          {/* Follow/Following Button */}
          <FollowToggleBtn id={profile._id} />
        </div>
        {/* Followers/Following Counts */}
        <div className="flex gap-4 text-xs mb-2">
          <span>
            <span className="font-bold">{following?.length}</span> Following
          </span>
          <span>
            <span className="font-bold">{followers?.length}</span> Followers
          </span>
        </div>
        <p className="text-sm mb-2 max-h-56 truncate">{bio}</p>
      </div>
    </div>
  );
};

export default UserHoverCard;
