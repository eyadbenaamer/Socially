import { useContext } from "react";
import { useParams } from "react-router-dom";

import RedBtn from "components/RedBtn";
import PrimaryBtn from "components/PrimaryBtn";
import CheckBox from "components/CheckBox";

import axiosClient from "utils/AxiosClient";
import { SelectedChatContext } from "pages/messaging";
import { useDialog } from "components/dialog/DialogContext";

import { ReactComponent as TrashIcon } from "assets/icons/trash-basket.svg";

const Delete = ({ id }) => {
  const { conversationId } = useParams();
  const { participantProfile } = useContext(SelectedChatContext);
  const { openDialog, closeDialog } = useDialog();

  let forEveryone = false;

  const deleteMessage = async () => {
    await axiosClient
      .delete(
        `message/delete?conversationId=${conversationId}&messageId=${id}&forEveryone=${forEveryone}`
      )
      .then(() => {
        document.body.style = null;
        closeDialog();
      });
  };

  const handleDeleteClick = () => {
    openDialog(
      <div className="p-2">
        <div className="w-full py-4">
          <p>Are you sure you want to delete this message?</p>
          <div className="flex gap-2 mt-4 ms-2 text-sm">
            <CheckBox
              onCheck={(checked) => {
                forEveryone = checked;
              }}
            />
            <span>Also delete for {participantProfile.firstName}</span>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <PrimaryBtn onClick={closeDialog}>Cancel</PrimaryBtn>
          <RedBtn onClick={deleteMessage}>Delete</RedBtn>
        </div>
      </div>
    );
  };

  return (
    <li>
      <button
        className="flex gap-2 p-3 bg-hovered w-full"
        onClick={handleDeleteClick}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Delete
      </button>
    </li>
  );
};

export default Delete;
