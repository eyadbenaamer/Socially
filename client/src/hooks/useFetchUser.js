import { useEffect, useState } from "react";

import axiosClient from "utils/AxiosClient";

const useFetchUser = (id) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (id) {
      axiosClient(`profile?id=${id}`).then((response) => {
        setUser(response.data);
      });
    }
  }, [id]);
  return [user, setUser];
};

export default useFetchUser;
