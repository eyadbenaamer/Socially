import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { submit } from "./submit";

import { PostContext } from "components/post";
import { PostsContext } from "components/posts";
import { setShowMessage } from "state";

const Form = (props) => {
  const { data, setData, setIsOpened } = props;
  const [isValidPost, setIsValidPost] = useState(false);
  const { username: myUsername } = useSelector((state) => state.profile);
  const { _id: postId, creatorId } = useContext(PostContext);
  const postsContext = useContext(PostsContext);

  const posts = postsContext?.posts;
  const setPosts = postsContext?.setPosts;

  const { username: currentPageUsername } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    if (data.text != "") {
      setIsValidPost(true);
    } else {
      setIsValidPost(false);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-3 w-[280px] sm:w-[500px] p-2">
      <textarea
        autoFocus
        value={data.text}
        className="mt-2"
        dir="auto"
        name="text"
        placeholder="Type anything about this...."
        onChange={(e) => {
          setData((prev) => ({ ...prev, text: e.target.value }));
        }}
      />
      <button
        disabled={!isValidPost}
        className={`${
          isValidPost ? "bg-primary" : "bg-secondary"
        } self-end py-2 px-4 rounded-xl text-white`}
        onClick={() => {
          setIsOpened(false);
          submit(data, creatorId, postId).then((response) => {
            setData({ text: "", location: "" });
            dispatch(setShowMessage("Post shared."));

            /*
            check if the current page is niether another user's page nor the home page
            if so, then the shared post will appear on the top of the existing posts
            */
            if (!currentPageUsername || myUsername == currentPageUsername) {
              if (!setPosts) {
                return;
              }
              if (posts) {
                setPosts([response, ...posts]);
              } else {
                setPosts(response);
              }
            }
          });
        }}
      >
        Share
      </button>
    </div>
  );
};

export default Form;
