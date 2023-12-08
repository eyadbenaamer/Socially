import Dialog from "components/Dialog";
import RedBtn from "components/RedBtn";
import { useContext, useState } from "react";
import { ReactComponent as TrashIcon } from "../../../../../../../assets/icons/trash-basket.svg";
import PrimaryBtn from "components/PrimaryBtn";
import { useSelector } from "react-redux";
import { PostContext } from "pages/post";

const Delete = (props) => {
  const { replyPath } = props;
  const user = useSelector((state) => state.user);

  const { setPost } = useContext(PostContext);
  const deleteReply = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    await fetch(`${API_URL}/posts/delete_reply/${replyPath}`, {
      method: "DELETE",
      headers: { authorization: user.token },
    }).then((response) => {
      setIsOpen((prev) => !prev);
      response.json().then((response) => setPost(response));
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
        <div className="w-full py-4 ">
          Are you sure you want to delete this reply?
        </div>
        <div className="flex justify-between mt-2">
          <PrimaryBtn onClick={() => setIsOpen(false)}>Cancel</PrimaryBtn>
          <RedBtn onClick={deleteReply}>Delete</RedBtn>
        </div>
      </Dialog>
    </li>
  );
};

export default Delete;
