import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Dialog from "components/dialog";
import UserPicture from "components/UserPicture";
import FollowToggleBtn from "components/FollowingBtn";
import HoverWrapper from "components/user-hover-card/HoverWrapper";

import { ProfileContext } from ".";

import axiosClient from "utils/AxiosClient";
import { useSelector } from "react-redux";
import convertToUnit from "utils/convertToUnit";

const Following = () => {
  const { following } = useContext(ProfileContext);
  const [showFollowing, setShowFollowing] = useState(false);
  const myProfile = useSelector((state) => state.profile);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = [];
      for (let i = 0; i < following?.length; i++) {
        const user = await axiosClient(`profile?id=${following[i]._id}`).then(
          (response) => response.data
        );
        result.push(user);
      }

      setUsers(result);
    };
    fetchUsers();
  }, [following]);

  return (
    <>
      {following?.length > 0 && (
        <div
          className="hover:text-[var(--primary-color)] hover:underline underline-offset-2 cursor-pointer"
          onClick={() => setShowFollowing(true)}
        >
          Following {convertToUnit(following?.length)}
        </div>
      )}
      <Dialog isOpened={showFollowing} setIsOpened={setShowFollowing}>
        <div className="px-4 flex flex-col gap-2 min-h-[50vh] w-[90vw] sm:w-[500px]">
          <div className="text-xl p-3">Following</div>
          <ul className="flex flex-col gap-3">
            {users?.map((user) => {
              const { _id: id, username, firstName, lastName } = user;
              return (
                <li className="flex items-center justify-between">
                  <div className="account flex gap-2 items-center">
                    <span className="w-12">
                      <UserPicture profile={user} />
                    </span>
                    <HoverWrapper profile={user}>
                      <Link to={`/profile/${username}`} className="link">
                        {firstName} {lastName}
                      </Link>
                    </HoverWrapper>
                  </div>
                  {myProfile?._id !== id && <FollowToggleBtn id={id} />}
                </li>
              );
            })}
          </ul>
        </div>
      </Dialog>

      {following?.length === 0 && <>Following 0</>}
    </>
  );
};

export default Following;
