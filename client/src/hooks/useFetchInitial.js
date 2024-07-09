import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setConversations } from "state";

import axiosClient from "utils/AxiosClient";

const useFetchInitial = () => {
  const { isLoggedin } = useSelector((state) => state.authStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedin) {
      return;
    }
    axiosClient("conversation/all")
      .then((response) => {
        dispatch(setConversations(response.data));
      })
      .catch((err) => {});
  }, [isLoggedin]);
};

export default useFetchInitial;
