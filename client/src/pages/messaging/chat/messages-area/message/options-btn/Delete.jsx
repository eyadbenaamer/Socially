import { useContext, useEffect, useState } from "react";

import Dialog from "components/dialog";
import RedBtn from "components/RedBtn";
import PrimaryBtn from "components/PrimaryBtn";

import axiosClient from "utils/AxiosClient";
import { ConversationContext } from "pages/messaging";

import { ReactComponent as TrashIcon } from "assets/icons/trash-basket.svg";
import { setConversation } from "state/index";
import { useParams } from "react-router-dom";
import CheckBox from "components/CheckBox";
import { socket } from "hooks/useHandleSocket";
import { useDispatch } from "react-redux";

const Delete = (props) => {
  const { id } = props;
  const { conversationId } = useParams();
  const [forEveryone, setForEveryone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const { participantProfile, conversation } = useContext(ConversationContext);

  const deleteMessage = async () => {
    await axiosClient
      .delete(
        `message/delete?conversationId=${conversationId}&messageId=${id}&forEveryone=${forEveryone}`
      )
      .then(() => {
        const newMessagesArray = conversation.messages.filter(
          (message) => message._id !== id
        );
        dispatch(
          setConversation({ ...conversation, messages: newMessagesArray })
        );

        document.body.style = null;
        setIsOpen((prev) => !prev);
      });
  };

  return (
    <li>
      <button
        className="flex gap-2 p-3 bg-hovered w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Delete
      </button>
      <Dialog isOpened={isOpen} setIsOpened={setIsOpen}>
        <div className="p-2">
          <div className="w-full py-4">
            <p>Are you sure you want to delete this message?</p>
            <div className="flex gap-2 mt-4 ms-2 text-sm">
              <CheckBox onCheck={(checked) => setForEveryone(checked)} />
              <span>Also delete for {participantProfile.firstName}</span>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <PrimaryBtn onClick={() => setIsOpen(false)}>Cancel</PrimaryBtn>
            <RedBtn onClick={deleteMessage}>Delete</RedBtn>
          </div>
        </div>
      </Dialog>
    </li>
  );
};

export default Delete;
