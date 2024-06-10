import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import axiosClient from "utils/AxiosClient";

const WhoLiked = (props) => {
  const { setIsOpened, likes } = props;
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      likes.map((id) => {
        axiosClient(`profile?id=${id}`).then((response) =>
          setProfiles((prev) => [...prev, response.data])
        );
      });
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-[250px] sm:w-[500px] p-2">
      <h1 className="py-2 text-lg">People Who Liked</h1>
      <ul className="flex flex-col gap-3">
        {profiles &&
          profiles.map((profile) => {
            return (
              <li
                onClick={() => setIsOpened(false)}
                key={profile._id}
                className="flex gap-2 items-center"
              >
                <UserPicture profile={profile} />
                <Link
                  reloadDocument={true}
                  to={`/profile/${profile.username}`}
                  className="hover:underline"
                >
                  {profile.firstName} {profile.lastName}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default WhoLiked;
