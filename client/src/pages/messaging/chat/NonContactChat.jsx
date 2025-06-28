import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import SendMessage from "./send-message";

import useFetchProfile from "hooks/useFetchProfile";

const NonContactChat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [nonContactProfile] = useFetchProfile(userId);

  const contacts = useSelector((state) => state.contacts);
  // this variable shows if the user is a contact
  const isContact = contacts.find((contact) => contact._id === userId);

  /*
  if the conversation is with a contact user
  then redirect to the contact chat component
  */
  if (isContact)
    navigate(`/messages/contact/${isContact.conversationId}`, {
      replace: true,
    });

  // if the user is not a valid user then redirect to the main messaging page
  if (nonContactProfile?.notfound) {
    navigate("/messages", { replace: true });
  }
  // otherwise the user is exist but they are not a contact
  return (
    <div className="px-4 w-full flex-1 relative">
      <div className="absolute bottom-0 left-0 w-full px-4">
        <SendMessage />
      </div>
    </div>
  );
};

export default NonContactChat;
