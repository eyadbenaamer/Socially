import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import ContactChat from "./ContactChat";
import NonContactChat from "./NonContactChat";
import ChatBar from "./ChatBar";

import { useWindowWidth } from "hooks/useWindowWidth";

const Chat = () => {
  const windowWidth = useWindowWidth();
  const { pathname } = useLocation();

  const { theme } = useSelector((state) => state.settings);

  const boxShadow =
    theme === "dark" ? "0 0 6px 1px #00000036" : "0 0 5px 0px #00000021";

  return (
    <div
      className="relative h-full bg-alt"
      style={{
        height: windowWidth < 1024 ? "calc(100vh - 95px)" : "",
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
