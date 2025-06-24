import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import ContactChat from "./ContactChat";
import NonContactChat from "./NonContactChat";
import ChatBar from "./ChatBar";

const Chat = () => {
  const { pathname } = useLocation();

  const { theme } = useSelector((state) => state.settings);

  const boxShadow =
    theme === "dark" ? "0 0 6px 1px #00000036" : "0 0 5px 0px #00000021";

  return (
    <div
      className="chat h-full bg-alt flex flex-col"
      style={{
        boxShadow,
      }}
    >
      <ChatBar />
      {pathname.startsWith("/messages/contact") && <ContactChat />}
      {pathname.startsWith("/messages/user") && <NonContactChat />}
    </div>
  );
};

export default Chat;
