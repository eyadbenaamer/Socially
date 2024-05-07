import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as SaveIcon } from "assets/icons/save.svg";
import { ReactComponent as UnsaveIcon } from "assets/icons/unsave.svg";
import { useEffect, useState } from "react";
import { setShowMessage } from "state";

const SavePost = (props) => {
  const { path } = props;
  const user = useSelector((state) => state.user);
  const [savedPosts, setSavedPosts] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;
  const savePost = () => {
    fetch(`${API_URL}/toggle_save_post/${path}/`, {
      method: "POST",
      headers: { Authorization: user.token },
    }).then(() => {
      if (!savedPosts.includes(path)) {
        dispatch(setShowMessage("Post saved."));
      } else {
        dispatch(setShowMessage("Post unsaved."));
      }
    });
  };
  useEffect(() => {
    fetch(`${API_URL}/saved_posts_ids/`, {
      method: "GET",
      headers: { Authorization: user.token },
    }).then((resposne) =>
      resposne.json().then((resposne) => setSavedPosts(resposne))
    );
  }, []);
  const dispatch = useDispatch();

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
