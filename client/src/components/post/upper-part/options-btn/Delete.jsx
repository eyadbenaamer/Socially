import axios from "axios";
import Prompt from "components/Prompt";
import RedBtn from "components/RedBtn";
import { useState } from "react";
import { ReactComponent as TrashIcon } from "../../../../assets/icons/trash-basket.svg";
import PrimaryBtn from "components/PrimaryBtn";

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
  return (
    <>
      <ul className="bg-300 bg-hovered radius w-max absolute -translate-x-28 ">
        <li
          className="flex gap-2 p-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="w-6">
            <TrashIcon />
          </span>
          Delete the post
        </li>
      </ul>
      {isOpen && (
        <Prompt isOpened={isOpen} setIsOpened={setIsOpen}>
          <div className="w-full  py-4">
            Are you sure you want to delete this post?
          </div>
          <div className="flex justify-between mt-2">
            <PrimaryBtn onClick={() => setIsOpen(false)}>Cancel</PrimaryBtn>
            <RedBtn onClick={deletePost}>Delete</RedBtn>
          </div>
        </Prompt>
      )}
    </>
  );
};

export default Delete;
