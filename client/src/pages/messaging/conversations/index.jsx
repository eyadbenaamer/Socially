import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Conversation from "./Conversation";
import { setConversations } from "state";
import axiosClient from "utils/AxiosClient";

import { ReactComponent as LoadingIcon } from "assets/icons/loading-circle.svg";

const Conversations = () => {
  const conversations = useSelector((state) => state.conversations);
  const [page, setPage] = useState(2);
  const dispatch = useDispatch();

  const loading = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    axiosClient("conversation/all")
      .then((response) => dispatch(setConversations(response.data)))
      .catch((err) => {});
  }, []);

  /*
  fetch the next page of conversations whenever scrolling 
  reaches the end of the coversations list 
  */
  useEffect(() => {
    const updatePage = () => {
      const conversationsEndLocation = Math.floor(loading.current?.offsetTop);
      const scroll = Math.floor(
        container.current.scrollTop + container.current.scrollHeight
      );
      if (scroll >= conversationsEndLocation) {
        fetchNextPage();
        container.current?.removeEventListener("scrollend", updatePage);
      }
    };
    container.current?.addEventListener("scrollend", updatePage);
    return () =>
      container.current?.removeEventListener("scrollend", updatePage);
  }, [page]);

  const fetchNextPage = () => {
    axiosClient(`conversation/all?page=${page}`)
      .then((response) => {
        /*
        if the conversations count is less than 10 or equal to 0 then it's the 
        end of the conversations list and loading elements will be removed
        */
        if (response.data?.length > 0) {
          dispatch(setConversations(response.data));
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
  return (
    <ul
      ref={container}
      className="flex flex-col overflow-y-scroll h-full py-4 px-2"
    >
      {conversations?.map((conversation) => (
        <li>
          <Conversation conversation={conversation} />
        </li>
      ))}
      {conversations?.length >= 10 && (
        <div ref={loading} className="w-8 self-center">
          <LoadingIcon className="icon" />
        </div>
      )}
    </ul>
  );
};

export default Conversations;
