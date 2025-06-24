import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import axiosClient from "utils/AxiosClient";
import FollowToggleBtn from "components/FollowingBtn";

const WhoLiked = (props) => {
  const { setIsOpened, likes } = props;
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
    <div className="w-[250px] sm:w-[500px] p-2">
      <h1 className="py-2 text-lg">People Who Liked</h1>
      <ul className="flex flex-col gap-3">
        {profiles?.map((profile) => (
          <li key={profile._id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-12">
                <UserPicture profile={profile} />
              </span>
              <Link
                to={`/profile/${profile.username}`}
                className="hover:underline"
              >
                {profile.firstName} {profile.lastName}
              </Link>
            </div>
            <FollowToggleBtn id={profile._id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhoLiked;
