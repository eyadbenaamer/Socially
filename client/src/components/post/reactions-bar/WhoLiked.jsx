import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import axiosClient from "utils/AxiosClient";
import FollowToggleBtn from "components/FollowingBtn";
import HoverWrapper from "components/user-hover-card/HoverWrapper";

const WhoLiked = (props) => {
  const { likes } = props;
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const profiles = [];
      for (let i = 0; i < likes.length; i++) {
        await axiosClient(`profile?id=${likes[i]._id}`).then((response) =>
          profiles.push(response.data)
        );
      }
      setProfiles(profiles);
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-[250px] sm:w-[500px] p-2 min-h-[50vh]">
      <h1 className="pb-4 text-lg">People Who Liked</h1>
      <ul className="flex flex-col gap-3">
        {profiles?.map((profile) => (
          <li key={profile._id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-12">
                <UserPicture profile={profile} />
              </span>
              <HoverWrapper profile={profile}>
                <Link
                  to={`/profile/${profile.username}`}
                  className="hover:underline h-fit"
                >
                  {profile.firstName} {profile.lastName}
                </Link>
              </HoverWrapper>
            </div>
            <FollowToggleBtn id={profile._id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhoLiked;
