import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import Layout from "layout";
import Notification from "./notification";
import LoadingNotification from "./LoadingNotification";

import {
  clearNotifications,
  setNotifications,
  setNotificationsAllRead,
  setUnreadNotificationsCount,
} from "state";

import axiosClient from "utils/AxiosClient";

const Notifications = () => {
  const [page, setPage] = useState(1);

  const notifications = useSelector((state) => state.notifications);
  const unreadNotificationsCount = useSelector(
    (state) => state.unreadNotificationsCount
  );
  const isAllRead = () => {
    for (let i = 0; i < notifications?.length; i++) {
      if (!notifications[i].isRead) {
        return false;
      }
    }
    return true;
  };
  const dispatch = useDispatch();

  const loading = useRef(null);
  const container = useRef(null);

  /*
set unread notifications count to zero whenever
it changes in /notifications route
*/
  useEffect(() => {
    if (unreadNotificationsCount > 0) {
      dispatch(setUnreadNotificationsCount(0));
    }
  }, [unreadNotificationsCount]);

  useEffect(() => {
    axiosClient("notifications?page=1")
      .then((response) => dispatch(setNotifications(response.data)))
      .catch((err) => {});
  }, []);

  /*
  fetch the next page of notifications whenever scrolling 
  reaches the end of the coversations list 
  */
  useEffect(() => {
    const updatePage = () => {
      const notificationsEndLocation = Math.floor(
        loading.current?.offsetTop - window.innerHeight
      );
      const scroll = Math.floor(window.scrollY);
      if (scroll >= notificationsEndLocation) {
        fetchNextPage();
        window.removeEventListener("scroll", updatePage);
      }
    };
    window.addEventListener("scroll", updatePage);
    return () => window.removeEventListener("scroll", updatePage);
  }, [page]);

  const fetchNextPage = () => {
    axiosClient(`notifications?page=${page}`)
      .then((response) => {
        /*
        if the notifications count is less than 10 or equal to 0 then it's the 
        end of the notifications list and loading elements will be removed
        */
        if (response.data?.length > 0) {
          if (page === 1) {
            dispatch(setNotifications(response.data));
          } else {
            dispatch(setNotifications([...notifications, ...response?.data]));
          }
          setPage(page + 1);
          if (response.data?.length < 10) {
            loading.current?.remove();
          }
        } else {
          loading.current?.remove();
        }
      })
      .catch((err) => {});
  };

  const setAllRead = () => {
    dispatch(setNotificationsAllRead());
    axiosClient.patch("notifications/set_read");
  };

  const clear = () => {
    dispatch(clearNotifications());
    axiosClient.delete("notifications/clear");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center py-4 sticky top-[45px] bg-100 z-30">
        <h1 className="text-2xl">Notifications</h1>
        <div className="flex gap-5">
          {!isAllRead() && (
            <div
              className="hover:underline text-primary transition cursor-pointer"
              onClick={setAllRead}
            >
              Set all read
            </div>
          )}
          {notifications?.length > 0 && (
            <div
              className="hover:underline text-primary transition cursor-pointer"
              onClick={clear}
            >
              Clear
            </div>
          )}
        </div>
      </div>
      {notifications?.length === 0 && <>No notifications</>}
      <ul ref={container} className="flex flex-col gap-2 pt-4">
        {notifications.map((notification) => (
          <li>
            <Notification {...notification} />
          </li>
        ))}
        {notifications?.length >= 10 && (
          <div ref={loading}>
            <LoadingNotification />
          </div>
        )}
      </ul>
    </Layout>
  );
};
export default Notifications;
