import { useContext } from "react";
import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import { SelectedChatContext } from "..";
import useGetTime from "./messages-area/message/getTime";

import { ReactComponent as ArrowLeftIcon } from "assets/icons/arrow-left.svg";

const ChatBar = () => {
  const { participant, participantProfile, conversation } =
    useContext(SelectedChatContext);

  const lastSeenAt = useGetTime(participant?.lastSeenAt);

  return (
    <div className="bg-alt flex gap-2 py-2 shadow-lg">
      <Link to={"/messages"} className="block w-8 icon py-2">
        <ArrowLeftIcon fill="currentColor" />
      </Link>
      {!participantProfile && (
        <>
          <div className="circle w-12 loading"></div>
          <div className="flex flex-col justify-center gap-2">
            <span className="loading w-24 h-2 rounded-md"></span>
            <span className="loading w-16 h-2 rounded-md"></span>
          </div>
        </>
      )}
      {participantProfile && (
        <>
          <UserPicture profile={participantProfile} />
          <div className="flex flex-col justify-around">
            <span className="font-bold">
              {participantProfile.firstName} {participantProfile.lastName}
            </span>
            {conversation.isTyping ? (
              <span className="text-xs text-primary">Typing...</span>
            ) : (
              <>
                {participant?.isOnline && (
                  <span className="text-xs text-primary">Online</span>
                )}
                {!participant?.isOnline && (
                  <span className="text-xs text-gray-500">
                    Last seen {lastSeenAt}
                  </span>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBar;
