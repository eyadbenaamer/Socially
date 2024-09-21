import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";

import { setConversation } from "state";

import Message from "./message";

import { ConversationContext } from "pages/messaging";
import axiosClient from "utils/AxiosClient";

const MessagesArea = () => {
  const { conversation } = useContext(ConversationContext);
  const dispatch = useDispatch();

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
  }, [conversation]);

  return (
    <div className="flex flex-col-reverse gap-4 py-8">
      {conversation?.messages.map((message) => (
        <Message message={message} />
      ))}
    </div>
  );
};

export default MessagesArea;
