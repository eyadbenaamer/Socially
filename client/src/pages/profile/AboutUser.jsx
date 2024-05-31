import { useContext } from "react";

import { ProfileContext } from ".";

import Following from "./Following";
import Followers from "./followers";

import { ReactComponent as LocationIcon } from "assets/icons/location.svg";
import { ReactComponent as CalenderIcon } from "assets/icons/calender.svg";

const AboutUser = () => {
  const { firstName, lastName, username, bio, location, joinedAt } =
    useContext(ProfileContext);

  const joinedAtMonth = new Date(joinedAt).toLocaleString("default", {
    month: "long",
  });
  const joinedAtYear = new Date(joinedAt).getFullYear();
  return (
    <div className="flex flex-col mx-2 gap-2">
      {/* contains name and username */}
      <div>
        <div className="name text-2xl">
          {firstName} {lastName}
        </div>
        <div className="user-name text-50">@{username}</div>
      </div>
      {bio && (
        <div className="bio text-sm text-ellipsis overflow-hidden max-w-md">
          {bio}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {location && (
          <div className="text-50 flex gap-1 items-center">
            <LocationIcon />
            {location}
          </div>
        )}
        <div className="text-50 flex gap-1 items-center">
          <CalenderIcon />
          Joined at {joinedAtMonth} {joinedAtYear}
        </div>
      </div>
      <div className="flex gap-2">
        <div>
          <Following />
        </div>
        <div>
          <Followers />
        </div>
      </div>
    </div>
  );
};

export default AboutUser;
