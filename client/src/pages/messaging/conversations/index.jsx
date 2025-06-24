import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Conversation from "./conversation";

import useUpdate from "hooks/useUpdate";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import axiosClient from "utils/AxiosClient";
import { setConversations } from "state";

import { ReactComponent as LoadingIcon } from "assets/icons/loading-circle.svg";

const Conversations = () => {
  const conversations = useSelector((state) => state.conversations);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const dispatch = useDispatch();

  const container = useRef(null);

  useUpdate();

  // Fetch initial conversations
  useEffect(() => {
    setIsInitialLoading(true);
    axiosClient("conversation/all?page=1")
      .then((response) => {
        const data = response.data;
        if (data?.length < 10) {
          setIsFinished(true);
        }
        dispatch(setConversations(data));
      })
      .catch((err) => {
        console.error("Failed to fetch initial conversations:", err);
      })
      .finally(() => setIsInitialLoading(false));
  }, [dispatch]);

  // Fetch next page of conversations
  const fetchNextPage = useCallback(async () => {
    if (isLoading || isFinished) return;

    setIsLoading(true);
    try {
      const response = await axiosClient(`conversation/all?page=${page}`);
      const data = response.data;

      if (data?.length > 0) {
        dispatch(setConversations([...conversations, ...data]));
        setPage((prev) => prev + 1);

        if (data.length < 10) {
          setIsFinished(true);
        }
      } else {
        setIsFinished(true);
      }
    } catch (err) {
      console.error("Failed to fetch next page of conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, isFinished, conversations, dispatch]);

  // Use infinite scroll hook
  const { loadingRef } = useInfiniteScroll(
    fetchNextPage,
    !isFinished,
    isLoading,
    {
      rootMargin: "100px",
      threshold: 0.1,
    }
  );

  return (
    <ul
      ref={container}
      className="conversations flex flex-col overflow-y-scroll h-full py-4 px-2 gap-2 pb-36"
    >
      {isInitialLoading && (
        <div className="w-8 self-center">
          <LoadingIcon className="icon animate-spin" />
        </div>
      )}

      {conversations?.length === 0 && !isInitialLoading && (
        <div className="mx-2">No conversations yet</div>
      )}

      {conversations?.map((conversation) => (
        <li key={conversation._id}>
          <Conversation conversation={conversation} />
        </li>
      ))}

      {!isFinished && conversations?.length >= 10 && (
        <div ref={loadingRef} className="w-8 self-center">
          <LoadingIcon className={`icon ${isLoading ? "animate-spin" : ""}`} />
        </div>
      )}
    </ul>
  );
};

export default Conversations;
