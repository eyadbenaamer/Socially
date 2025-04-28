import { useContext } from "react";
import { Navigate } from "react-router-dom";

import SendMessage from "./send-message";
import MessagesArea from "./messages-area";

import { SelectedChatContext } from "..";

const ContactChat = () => {
  const { conversation } = useContext(SelectedChatContext);

  /*
  if the conversation is is not exist (not a contact)
  then redirect to the main messaging page
  */
  if (!conversation) return <Navigate to={"/messages"} replace />;

  // otherwise the conversation is with a contact user
  return (
    <>
      <div className="px-2 h-[80%]">
        <MessagesArea unreadMessagesCount={conversation.unreadMessagesCount} />
      </div>
      <div className="absolute bottom-0 px-4 w-full">
        <SendMessage />
      </div>
    </>
  );
};
//
export default ContactChat;
