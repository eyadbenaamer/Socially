import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import UserPicture from "components/UserPicture";

import useGetTime from "./messages-area/message/getTime";

import { ReactComponent as ArrowLeftIcon } from "assets/icons/arrow-left.svg";

const ChatBar = (props) => {
  const { participantProfile } = props;
  const contacts = useSelector((state) => state.contacts);

  const participant = contacts.find(
    (contact) => contact._id === participantProfile._id
  );
  const lastSeenAt = useGetTime(participant.lastSeenAt);

  return (
    <div className="bg-alt flex gap-2 py-2 shadow-lg">
      <Link to={"/messages"} className="block w-8 icon py-2">
        <ArrowLeftIcon fill="currentColor" />
      </Link>
      {participantProfile && (
        <>
          <UserPicture profile={participantProfile} />
          <div className="flex flex-col justify-around">
            <span className="font-bold">
              {participantProfile.firstName} {participantProfile.lastName}
            </span>
            {participant.isOnline && (
              <span className="text-xs text-primary">Online</span>
            )}
            {!participant.isOnline && (
              <span className="text-xs text-gray-500">
                Last seen {lastSeenAt}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBar;
