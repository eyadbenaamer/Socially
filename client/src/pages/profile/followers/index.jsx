import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Dialog from "components/dialog";
import UserPicture from "components/UserPicture";
import FollowToggleBtn from "components/FollowingBtn";
import RemoveFollowerBtn from "./RemoveFollowerBtn";

import { ProfileContext } from "..";

import axiosClient from "utils/AxiosClient";
import convertToUnit from "utils/convertToUnit";

const Followers = () => {
  const { followers } = useContext(ProfileContext);
  const [users, setUsers] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = [];
      for (let i = 0; i < followers?.length; i++) {
        const user = await axiosClient(`profile?id=${followers[i]}`).then(
          (response) => response.data
        );
        result.push(user);
      }
      setUsers(result);
    };
    fetchUsers();
  }, [followers]);

  return (
    <>
      {followers?.length > 0 && (
        <div
          className="hover:text-[var(--primary-color)] hover:underline underline-offset-2 cursor-pointer"
          onClick={() => setShowFollowers(true)}
        >
          Followers {convertToUnit(followers?.length)}
        </div>
      )}
      <Dialog isOpened={showFollowers} setIsOpened={setShowFollowers}>
        <div className="px-4 flex flex-col gap-2 w-[90vw] sm:w-[500px]">
          <div className="text-xl">Followers</div>
          <ul className="flex flex-col gap-3">
            {users?.map((user) => {
              const { _id: id, profilePicPath, firstName, lastName } = user;
              return (
                <li className="flex items-center justify-between">
                  <div className="account flex gap-2 items-center">
                    <UserPicture
                      id={id}
                      src={profilePicPath}
                      name={`${firstName} ${lastName}`}
                    />
                    <Link to={`/profile/${id}`} reloadDocument className="link">
                      {firstName} {lastName}
                    </Link>
                  </div>
                  <div className="flex gap-2 items-center">
                    <FollowToggleBtn id={id} />
                    <RemoveFollowerBtn id={id} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Dialog>

      {followers?.length === 0 && <>Followers 0</>}
    </>
  );
};

export default Followers;
