import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useFetchUser = (id) => {
  const [user, setUser] = useState(useSelector((state) => state.user));
  useEffect(() => {
    const getUser = async () => {
      let user = await axios
        .get(`${process.env.REACT_APP_API_URL}/profile/${id}`)
        .then((response) => {
          return response.data;
        });
      setUser(user);
    };
    if (id !== user._id) {
      setUser(getUser());
    }
  }, []);
  return [user, setUser];
};

export default useFetchUser;
