import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import SendMessage from "./send-message";

import useFetchProfile from "hooks/useFetchProfile";

const NonContactChat = () => {
  const { userId } = useParams();

  const [nonContactProfile] = useFetchProfile(userId);

  const contacts = useSelector((state) => state.contacts);
  // this variable shows if the user is a contact
  const isContact = contacts.find((contact) => contact._id === userId);

  /*
  if the conversation is with a contact user
  then redirect to the contact chat component
  */
  if (isContact)
    return (
      <Navigate to={`/messages/contact/${isContact.conversationId}`} replace />
    );

  // if the user is not a valid user then redirect to the main messaging page
  if (nonContactProfile?.notfound) {
    return <Navigate to="/messages" replace />;
  }
  // otherwise the user is exist but they are not a contact
  return (
    <div className="absolute bottom-0 px-4 w-full">
      <SendMessage />
    </div>
  );
};

export default NonContactChat;
