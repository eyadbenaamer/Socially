import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import axiosClient from "utils/AxiosClient";

const WhoLiked = (props) => {
  const { setIsOpened, likes } = props;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      likes.map((id) => {
        axiosClient(`profile?id=${id}`).then((response) =>
          setUsers((prev) => [...prev, response.data])
        );
      });
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-[250px] sm:w-[500px] p-2">
      <h1 className="py-2 text-lg">People Who Liked</h1>
      <ul className="flex flex-col gap-3">
        {users &&
          users.map((user) => {
            return (
              <li
                onClick={() => setIsOpened(false)}
                key={user._id}
                className="flex gap-2 items-center"
              >
                <UserPicture
                  id={user._id}
                  src={user.avatarPath}
                  name={`${user.firstName} ${user.lastName}`}
                />
                <Link
                  reloadDocument={true}
                  to={`/profile/${user._id}`}
                  className="hover:underline"
                >
                  {user.firstName} {user.lastName}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default WhoLiked;
