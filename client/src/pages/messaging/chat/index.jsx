import { useContext } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import ChatBar from "./ChatBar";
import SendMessage from "./send-message";
import MessagesArea from "./messages-area";

import { ConversationContext } from "..";
import { useWindowWidth } from "hooks/useWindowWidth";

const Chat = () => {
  const windowWidth = useWindowWidth();
  const { conversation } = useContext(ConversationContext);

  const { theme } = useSelector((state) => state.settings);

  const transition = {
    initial: { x: 1000 },
    animate: { x: 0 },
    transition: { duration: 0.7 },
  };
  const boxShadow =
    theme === "dark" ? "0 0 6px 1px #00000036" : "0 0 5px 0px #00000021";

  return (
    <motion.div
      {...transition}
      className="relative h-full bg-alt"
      style={{
        height: windowWidth < 1024 ? "calc(100vh - 95px)" : "",
        boxShadow,
      }}
    >
      <ChatBar />
      <div className="px-2 h-[80%]">
        <MessagesArea unreadMessagesCount={conversation.unreadMessagesCount} />
      </div>
      <div className="absolute bottom-0 px-4 w-full">
        <SendMessage />
      </div>
    </motion.div>
  );
};

export default Chat;
