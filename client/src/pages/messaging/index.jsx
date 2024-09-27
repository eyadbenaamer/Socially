import { createContext, useEffect, useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setUnreadMessagesCount } from "state";

import Sidebar from "components/sidebar";
import Contact from "./contact";
import Conversations from "./conversations";

import { useWindowWidth } from "hooks/useWindowWidth";
import useFetchProfile from "hooks/useFetchProfile";

export const ConversationContext = createContext();

const Messaging = () => {
  const { conversationId } = useParams();
  const windowWidth = useWindowWidth();

  const myProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const contacts = useSelector((state) => state.contacts);
  const onlineContactsIds = useMemo(
    () => contacts.filter((contact) => contact.isOnline),
    [contacts]
  );
  const offlineContactsIds = useMemo(
    () => contacts.filter((contact) => !contact.isOnline),
    [contacts]
  );
  const conversations = useSelector((state) => state.conversations);
  const conversation = conversations?.find(
    (conv) => conv._id === conversationId
  );
  const participantId = conversation?.participants.find(
    (part) => part._id !== myProfile._id
  )._id;

  // to fetch the other participant's info in the conversation
  let [participantProfile, setParicipantProfile] =
    useFetchProfile(participantId);
  let participant = contacts.find((contact) => contact._id === participantId);

  // for all conversations
  const unreadMessagesCount = useSelector((state) => state.unreadMessagesCount);

  // this removes the unread messages count label on the conversations logo
  useEffect(() => {
    if (unreadMessagesCount) {
      dispatch(setUnreadMessagesCount(0));
    }
  }, [conversation]);

  useEffect(() => {
    setParicipantProfile(null);
  }, [conversationId]);

  return (
    <>
      <ConversationContext.Provider
        value={{
          conversation,
          participantProfile,
          participant,
        }}
      >
        {/*the chat is taking the entire screen for small screens*/}
        {windowWidth < 768 && conversationId && (
          <div className="fixed left-0 z-20 w-full">
            <Outlet />
          </div>
        )}
        <>
          <div className="grid grid-cols-10">
            {windowWidth >= 1024 && (
              <div className="sidebar pt-5 flex justify-center col-span-2">
                <Sidebar />
              </div>
            )}
            <div
              style={{
                height:
                  windowWidth >= 1024
                    ? "calc(100vh - 45px)"
                    : "calc(100vh - 95px)",
              }}
              className="content bg-200 col-span-10 lg:col-span-8 md:mx-0 grid grid-rows-6 grid-cols-3 overflow-x-hidden"
            >
              <div
                className="contacts flex items-center gap-2 px-2 w-full col-span-3 md:col-span-1 overflow-x-scroll"
                style={{ scrollbarWidth: "none" }}
              >
                {onlineContactsIds.map((contact) => (
                  <Contact id={contact._id} isOnline={contact.isOnline} />
                ))}
                {offlineContactsIds.map((contact) => (
                  <Contact id={contact._id} isOnline={contact.isOnline} />
                ))}
              </div>
              <div className="col-span-3 sm:col-span-2 md:col-span-1 row-span-6 row-start-2">
                <Conversations />
              </div>
              {/* for large screens the chat will take a part of 
                the screen rather than the entire screen */}
              {windowWidth >= 768 && (
                <div className="chat overflow-hidden md:col-span-2 bg-200 row-span-6">
                  <Outlet />
                </div>
              )}
            </div>
          </div>
        </>
      </ConversationContext.Provider>
    </>
  );
};
export default Messaging;
