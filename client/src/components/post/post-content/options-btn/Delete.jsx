import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";

import Dialog from "components/dialog";
import RedBtn from "components/RedBtn";
import PrimaryBtn from "components/PrimaryBtn";
import { PostContext } from "components/post";
import { PostsContext } from "components/posts";

import axiosClient from "utils/AxiosClient";

import { ReactComponent as TrashIcon } from "assets/icons/trash-basket.svg";

const Delete = () => {
  const location = useLocation();

  const { _id: postId, creatorId } = useContext(PostContext);
  const setPosts = useContext(PostsContext)?.setPosts;

  const [isOpen, setIsOpen] = useState(false);

  const deletePost = async () => {
    await axiosClient
      .delete(`post/delete?userId=${creatorId}&postId=${postId}`)
      .then(() => {
        document.body.style = null;
        setIsOpen(false);

        /*
          if the post is rendered in post page then go back to the previous page
          otherwise update the posts list after deleting the post
        */
        if (location.pathname.startsWith("/post")) {
          window.history.back();
        } else {
          setPosts((prev) => prev.filter((post) => post._id !== postId));
        }
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
        Delete the post
      </button>

      <Dialog isOpened={isOpen} setIsOpened={setIsOpen}>
        <div className="p-2">
          <div className="w-full py-4 ">
            Are you sure you want to delete this post?
          </div>
          <div className="flex justify-between mt-2">
            <PrimaryBtn onClick={() => setIsOpen(false)}>Cancel</PrimaryBtn>
            <RedBtn onClick={deletePost}>Delete</RedBtn>
          </div>
        </div>
      </Dialog>
    </li>
  );
};

export default Delete;
