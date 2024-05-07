import UserPicture from "components/UserPicture";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const WhoLiked = (props) => {
  const { setIsOpened, likes } = props;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      likes.map((id) => {
        fetch(`${API_URL}/profile/${id}/`).then((resolved) =>
          resolved
            .json()
            .then((response) => setUsers((prev) => [...prev, response]))
        );
      });
    };
    fetchUsers();
  }, []);
  const { id: currentId } = useParams();
  return (
    <div className="w-[250px] sm:w-[500px] px-2">
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
