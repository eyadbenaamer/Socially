import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import UserPicture from "../UserPicture";
import Status from "../chat/messages-area/message/Status";
import Time from "components/time";

import useFetchProfile from "hooks/useFetchProfile";

const Conversation = ({ conversation }) => {
  const { conversationId } = useParams();
  const myProfile = useSelector((state) => state.profile);
  const theme = useSelector((state) => state.settings.theme);

  const participantId = conversation.participants?.find(
    (participant) => participant._id !== myProfile._id
  )._id;
  const [senderProfile] = useFetchProfile(participantId);
  const { unreadMessagesCount } = conversation;
  const lastMessage = conversation.messages[0];
  const isOnline = useSelector((state) => state.contacts).find(
    (contact) => contact._id === participantId
  )?.isOnline;

  return (
    <>
      {senderProfile && (
        <Link
          to={conversation._id}
          className={`block ${
            conversationId === conversation._id ? "bg-alt" : ""
          } bg-hovered p-2 rounded-xl transition cursor-pointer`}
        >
          <div className="grid grid-cols-12">
            <div className="col-span-2 lg:col-span-2 ">
              <UserPicture profile={senderProfile} isOnline={isOnline} />
            </div>

            <div className="flex flex-col col-span-10  lg:col-span-10 px-2 justify-around">
              <div className="flex items-center gap-2">
                <div
                  className={`${unreadMessagesCount > 0 ? "font-bold" : ""} `}
                  style={{
                    textWrap: " nowrap",
                    maxWidth: "85%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {senderProfile.firstName} {senderProfile.lastName}
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
                <div className="flex items-center  h-fit self-end text-xs text-gray-500">
                  {lastMessage?.senderId === myProfile._id && (
                    <Status info={lastMessage.info} />
                  )}
                  <Time date={conversation.updatedAt} withDate />
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default Conversation;
