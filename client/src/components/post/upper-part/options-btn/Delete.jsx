import axios from "axios";
import Dialog from "components/Dialog";
import RedBtn from "components/RedBtn";
import { useState } from "react";
import { ReactComponent as TrashIcon } from "../../../../assets/icons/trash-basket.svg";
import PrimaryBtn from "components/PrimaryBtn";
import { useSelector } from "react-redux";

const Delete = (props) => {
  const { id, user } = props;
  const deletePost = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    await fetch(`${API_URL}/posts/delete_post/${user._id}/${id}`, {
      method: "DELETE",
      headers: { authorization: user.token },
    });
    window.location.reload();
  };
  const [isOpen, setIsOpen] = useState(false);
  const mode = useSelector((state) => state.settings.mode);

  return (
    <li>
      <button
        className="flex gap-2 p-3 bg-hovered w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-6">
          <TrashIcon />
        </span>
        Delete the post
      </button>
      <Dialog isOpened={isOpen} setIsOpened={setIsOpen}>
        <div className="w-full py-4 ">
          Are you sure you want to delete this post?
        </div>
        <div className="flex justify-between mt-2">
          <PrimaryBtn onClick={() => setIsOpen(false)}>Cancel</PrimaryBtn>
          <RedBtn onClick={deletePost}>Delete</RedBtn>
        </div>
      </Dialog>
    </li>
  );
};

export default Delete;
