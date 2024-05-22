import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { submit } from "./submit";

import DropZone from "components/dropzone";
import { PostsContext } from "components/posts";

const Form = (props) => {
  const { data, setData, media, setMedia, setIsOpened } = props;
  const { posts, setPosts } = useContext(PostsContext);

  const [isValidPost, setIsValidPost] = useState(false);
  const { token } = useSelector((state) => state.profile);

  useEffect(() => {
    if (data.text != "" || media) {
      setIsValidPost(true);
    } else {
      setIsValidPost(false);
    }
  }, [data, media]);

  return (
    <div className="flex flex-col gap-3 w-[280px] sm:w-[500px] p-2">
      <textarea
        autoFocus
        value={data.text}
        className="mt-2"
        dir="auto"
        name="text"
        placeholder="Type Anything!"
        onChange={(e) => {
          setData((prev) => ({ ...prev, text: e.target.value }));
        }}
      />
      <DropZone files={media} setFiles={setMedia} />
      <button
        disabled={!isValidPost}
        className={`${
          isValidPost ? "bg-primary" : "bg-secondary"
        } self-end py-2 px-4 rounded-xl text-white`}
        onClick={async () => {
          setIsOpened(false);
          setData({ text: "", location: "" });
          setMedia(null);
          submit(data, media, token).then((response) => {
            if (posts) {
              setPosts([response, ...posts]);
            } else {
              setPosts(response);
            }
          });
        }}
      >
        Post
      </button>
    </div>
  );
};

export default Form;
