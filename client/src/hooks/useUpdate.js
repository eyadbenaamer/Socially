import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  logout,
  setAuthStatus,
  setContacts,
  setProfile,
  setUnreadMessagesCount,
  setUnreadNotificationsCount,
} from "state";

import axiosClient from "utils/AxiosClient";

const useUpdate = () => {
  const { isLoggedin, isVerified } = useSelector((state) => state.authStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedin || !isVerified) {
      return;
    }
    axiosClient(`/login`)
      .then((response) => {
        if (response.status === 200) {
          const { contacts, unreadMessagesCount, unreadNotificationsCount } =
            response.data;
          dispatch(setUnreadMessagesCount(unreadMessagesCount));
          dispatch(setUnreadNotificationsCount(unreadNotificationsCount));
          dispatch(setContacts(contacts));
          dispatch(setAuthStatus({ isLoggedin: true }));
        }
      })
      .catch(() => {
        dispatch(logout());
      });
  }, [dispatch, isLoggedin, isVerified]);
};

export default useUpdate;
