import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setShowMessage } from "state";

import axiosClient from "utils/AxiosClient";

import { ReactComponent as SaveIcon } from "assets/icons/save.svg";
import { ReactComponent as UnsaveIcon } from "assets/icons/unsave.svg";

const SavePost = (props) => {
  const { path } = props;
  const [savedPosts, setSavedPosts] = useState([]);
  const dispatch = useDispatch();

  const savePost = () => {
    axiosClient(`toggle_save_post/${path}/`).then(() => {
      if (!savedPosts.includes(path)) {
        dispatch(setShowMessage("Post saved."));
      } else {
        dispatch(setShowMessage("Post unsaved."));
      }
    });
  };

  useEffect(() => {
    axiosClient(`saved_posts_ids/`).then((resposne) =>
      setSavedPosts(resposne.data)
    );
  }, []);

  return (
    <li>
      <button
        className="flex w-full gap-2 p-3 bg-hovered"
        onClick={() => savePost()}
      >
        {!savedPosts.includes(path) ? (
          <>
            <span className="w-6">
              <SaveIcon />
            </span>
            Save the post
          </>
        ) : (
          <>
            <span className="w-6">
              <UnsaveIcon />
            </span>
            Unsave the post
          </>
        )}
      </button>
    </li>
  );
};

export default SavePost;
