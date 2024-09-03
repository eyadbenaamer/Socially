import { useEffect, useState } from "react";

import axiosClient from "utils/AxiosClient";

const useFetchProfile = (id) => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (id) {
      axiosClient(`profile?id=${id}`).then((response) => {
        setProfile(response.data);
      });
    }
  }, [id]);
  return [profile, setProfile];
};

export default useFetchProfile;
