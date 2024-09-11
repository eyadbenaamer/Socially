import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  logout,
  setAuthStatus,
  setContacts,
  setConversations,
  setProfile,
  setUnreadMessagesCount,
} from "state";

import axiosClient from "utils/AxiosClient";

const useUpdate = () => {
  const { isLoggedin } = useSelector((state) => state.authStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedin) {
      return;
    }
    axiosClient(`/login`)
      .then((response) => {
        if (response.status === 200) {
          const { profile, contacts, unreadMessagesCount } = response.data;
          dispatch(setProfile(profile));
          dispatch(setUnreadMessagesCount(unreadMessagesCount));
          dispatch(setContacts(contacts));
          dispatch(setAuthStatus({ isLoggedin: true }));
        }
      })
      .catch(() => {
        dispatch(logout());
      });
  }, [isLoggedin]);
};

export default useUpdate;
