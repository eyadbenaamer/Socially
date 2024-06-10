import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import axiosClient from "utils/AxiosClient";

const Following = () => {
  const following = useSelector((state) => state.profile.following);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = [];
      for (let i = 0; i < following?.length; i++) {
        const user = await axiosClient(`profile?id=${following[i]}`).then(
          (response) => response.data
        );
        result.push(user);
      }
      setUsers(result);
    };
    fetchUsers();
  }, [following]);

  return (
    <section className="fixed flex flex-col gap-5 px-2 h-[80vh]">
      <h1 className="text-lg">People you follow</h1>
      <ul className="flex flex-col gap-3 overflow-y-scroll w-[250px] center py-2">
        {/* show only 20 following if following more than 20, otherwise show them all  */}
        {users &&
          users.slice(0, users.length < 20 ? users.length : 20).map((user) => {
            const { username, firstName, lastName } = user;
            return (
              <li className="flex items-center">
                <div className="account flex gap-2 items-center">
                  <UserPicture profile={user} />
                  <Link to={`/profile/${username}`} className="link">
                    {firstName} {lastName}
                  </Link>
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
export default Following;
