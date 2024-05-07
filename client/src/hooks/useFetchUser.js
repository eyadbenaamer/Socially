import axios from "axios";
import { useEffect, useState } from "react";

const useFetchUser = (id) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/profile/${id}`)
        .then((response) => {
          setUser(response.data);
        });
    }
  }, [id]);
  return [user, setUser];
};

export default useFetchUser;
