import { useContext, useState } from "react";
import { useSelector } from "react-redux";

import { PostContext } from "components/post";
import Dialog from "components/dialog";
import RedBtn from "components/RedBtn";
import PrimaryBtn from "components/PrimaryBtn";

import axiosClient from "utils/AxiosClient";

import { ReactComponent as TrashIcon } from "assets/icons/trash-basket.svg";

const Delete = (props) => {
  const { userId, postId, commentId, replyId } = props;
  const { setPost } = useContext(PostContext);

  const deleteReply = async () => {
    await axiosClient
      .delete(
        `reply/delete?userId=${userId}&postId=${postId}&commentId=${commentId}&replyId=${replyId}`
      )
      .then((response) => {
        setIsOpen((prev) => !prev);
        setPost(response.data);
      });
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="flex gap-2 p-3 bg-hovered w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Delete the reply
      </button>
      <Dialog isOpened={isOpen} setIsOpened={setIsOpen}>
        <div className="p-2">
          <div className="w-full py-4 ">
            Are you sure you want to delete this reply?
          </div>
          <div className="flex justify-between mt-2">
            <PrimaryBtn onClick={() => setIsOpen(false)}>Cancel</PrimaryBtn>
            <RedBtn onClick={deleteReply}>Delete</RedBtn>
          </div>
        </div>
      </Dialog>
    </li>
  );
};

export default Delete;
