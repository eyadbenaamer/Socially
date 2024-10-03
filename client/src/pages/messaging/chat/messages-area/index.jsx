import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setConversation } from "state";

import Message from "./message";

import { ConversationContext } from "pages/messaging";
import axiosClient from "utils/AxiosClient";
import Time from "components/time";

import { ReactComponent as LoadingIcon } from "assets/icons/loading-circle.svg";

const MessagesArea = (props) => {
  const dispatch = useDispatch();

  const { conversation } = useContext(ConversationContext);

  const firstUnreadMessageId = useMemo(
    () => conversation.messages[props.unreadMessagesCount - 1]?._id,
    []
  );
  const { conversationId } = useParams();
  const [page, setPage] = useState(2);
  // this indicates wether if the chat is closed or not
  const [isClosed, setIsClosed] = useState(false);
  // this indicates wether if there is more messages to fetch or not
  const [isMessagesFinished, setIsMessagesFinished] = useState(false);

  const container = useRef(null);
  const loading = useRef(null);

  /*
  if there is unread messages then the whole conversation 
  will be set as read once the component loads
  */
  useEffect(() => {
    if (conversation.unreadMessagesCount) {
      axiosClient(`/conversation/set_read?conversationId=${conversation._id}`)
        .then(() =>
          dispatch(
            setConversation({ _id: conversation._id, unreadMessagesCount: 0 })
          )
        )
        .catch((err) => {
          // TODO: handle error
        });
    }
  }, [conversation, conversationId]);

  // closing the chat by Esc button
  useEffect(() => {
    const eventHandler = (e) => {
      if (e.key === "Escape") {
        setIsClosed(true);
      }
    };
    window.addEventListener("keydown", eventHandler);
    return () => window.removeEventListener("keydown", eventHandler);
  }, []);

  /*
  fetching the first page of messages if there is not unread meassages, next pages will be
  fetched on "conversations" component, each page is fetched 
  when the screen renders the last message of the previous page.
  */
  useEffect(() => {
    axiosClient(`/conversation/?conversationId=${conversation._id}&page=1`)
      .then((response) => {
        const { messages } = response?.data;
        if (messages?.length < 10) {
          setIsMessagesFinished(true);
        }
        dispatch(setConversation(response.data));
      })
      .catch((err) => {
        // TODO: handle error
      });
    // resting states once the conversation changes
    setIsMessagesFinished(false);
    setPage(2);
    // this to reset the messages container scroll every time the conversation changes
    if (container.current) {
      container.current.scroll({ top: 0 });
    }
  }, [conversationId, container.current]);

  /*
  fetch the next page of messages whenever scrolling 
  reaches the end of the messages list 
  */
  useEffect(() => {
    const updatePage = () => {
      const conversationsEndLocation =
        Math.floor(loading.current?.offsetTop) * -1;
      const scroll = Math.floor(container.current.scrollTop) * -1;

      if (scroll >= conversationsEndLocation / 2) {
        fetchNextPage();
        container.current?.removeEventListener("scrollend", updatePage);
      }
    };
    container.current?.addEventListener("scrollend", updatePage);
    return () =>
      container.current?.removeEventListener("scrollend", updatePage);
  }, [page, conversationId]);

  const fetchNextPage = () => {
    axiosClient(
      `/conversation/?conversationId=${conversation._id}&page=${page}`
    )
      .then((response) => {
        const { messages } = response?.data;
        /*
        if the conversations count is less than 10 or equal to 0 then it's the 
        end of the conversations list and loading elements will be removed
        */
        if (messages?.length > 0) {
          dispatch(
            setConversation({
              ...conversation,
              messages: [...conversation.messages, ...messages],
            })
          );
          setPage(page + 1);
          if (messages?.length < 10) {
            setIsMessagesFinished(true);
          }
        } else {
          setIsMessagesFinished(true);
        }
      })
      .catch((err) => {});
  };
  console.log(conversation?.messages);
  return (
    <>
      {isClosed && <Navigate to="/messages" replace />}
      <div
        ref={container}
        className="containera overflow-y-scroll h-full flex flex-col-reverse gap-4 py-5 px-1"
      >
        {conversation?.messages.map((message, i) => {
          const thisMessageDate = new Date(message.createdAt);
          const nextMessageDate = new Date(
            conversation.messages[i + 1]?.createdAt
          );
          const isToday =
            thisMessageDate.getDate() === nextMessageDate.getDate() &&
            thisMessageDate.getMonth() === nextMessageDate.getMonth() &&
            thisMessageDate.getFullYear() === thisMessageDate.getFullYear();
          return (
            <>
              <Message message={message} />
              {!isToday && (
                <div className="self-center bg-200 px-3 p-1 rounded-xl">
                  <Time date={message.createdAt} withDate forChat />
                </div>
              )}
              {firstUnreadMessageId === message._id && (
                <div className="self-center bg-300 px-3 p-1 rounded-xl shadow-sm">
                  Unread Messages
                </div>
              )}
            </>
          );
        })}
        {!isMessagesFinished && (
          <div ref={loading} className="w-8 center py-2">
            <LoadingIcon className="icon" />
          </div>
        )}
      </div>
    </>
  );
};

export default MessagesArea;
