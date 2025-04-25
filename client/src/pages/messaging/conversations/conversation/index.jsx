import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Time from "components/time";
import UserPicture from "pages/messaging/UserPicture";
import Status from "pages/messaging/chat/messages-area/message/Status";

import useFetchProfile from "hooks/useFetchProfile";
import OptionsBtn from "./options-btn";
import { createContext } from "react";

export const ConversationContext = createContext();

const Conversation = ({ conversation }) => {
  const { conversationId } = useParams();
  const myProfile = useSelector((state) => state.profile);
  const theme = useSelector((state) => state.settings.theme);

  const participantId = conversation.participants?.find(
    (participant) => participant._id !== myProfile._id
  )._id;
  const [participantProfile] = useFetchProfile(participantId);
  const { unreadMessagesCount } = conversation;
  const lastMessage = conversation.messages[0];
  const isOnline = useSelector((state) => state.contacts).find(
    (contact) => contact._id === participantId
  )?.isOnline;

  if (!participantProfile) {
    return null;
  }

  return (
    <ConversationContext.Provider value={{ participantProfile }}>
      <div
        className={`group block ${
          conversationId === conversation._id ? "bg-alt" : ""
        } bg-hovered p-2 rounded-xl transition`}
      >
        <div className="grid grid-cols-12 relative items-center">
          <Link to={conversation._id} className="col-span-2 lg:col-span-2 ">
            <UserPicture profile={participantProfile} isOnline={isOnline} />
          </Link>

          <Link
            to={conversation._id}
            className="flex flex-col col-span-8  lg:col-span-8 px-2 justify-around"
          >
            <div className="flex items-center gap-2">
              <div
                className={`${unreadMessagesCount > 0 ? "font-bold" : ""} `}
                style={{
                  textWrap: "nowrap",
                  maxWidth: "85%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {participantProfile.firstName} {participantProfile.lastName}
              </div>
              {unreadMessagesCount > 0 && (
                <div className="circle w-5 h-5 bg-primary text-xs text-white">
                  {unreadMessagesCount}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div
                className={`flex w-full text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-800"
                }`}
              >
                <div className="h-4 overflow-hidden">
                  {!lastMessage && "No Messages."}
                  {lastMessage?.senderId === myProfile._id && "You: "}
                  {lastMessage?.text.slice(0, 20)}
                  {lastMessage?.text.length > 20 ? "..." : ""}
                </div>
              </div>
              <div className="flex items-center h-fit self-end text-xs text-gray-500">
                {lastMessage?.senderId === myProfile._id && (
                  <Status info={lastMessage.info} />
                )}
                <Time date={conversation.updatedAt} withDate />
              </div>
            </div>
          </Link>

          {/* OptionsBtn, only visible on hover */}
          <div className="col-span-2 sopacity-0 group-hover:opacity-100 transition-opacity">
            <OptionsBtn conversationId={conversation._id} />
          </div>
        </div>
      </div>
    </ConversationContext.Provider>
  );
};

export default Conversation;
