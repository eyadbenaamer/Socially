import { useEffect, useRef, useState } from "react";
import { submit } from "./submit";
import { useDispatch, useSelector } from "react-redux";
import DropZone from "components/dropzone";

const Form = (props) => {
  const { data, setData, media, setMedia, setIsOpened, setCreatedPost } = props;
  const [isValidPost, setIsValidPost] = useState(false);
  const { token } = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  useEffect(() => {
    if (data.text != "" || media) {
      setIsValidPost(true);
    } else {
      setIsValidPost(false);
    }
  }, [data, media]);
  return (
    <div className="flex flex-col gap-3">
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
      <DropZone multiple onChange={(files) => setMedia(files)} />
      <button
        disabled={!isValidPost}
        className={`${
          isValidPost ? "bg-primary" : "bg-secondary"
        } self-end py-2 px-4 radius text-white`}
        onClick={async () => {
          setIsOpened(false);
          setData({ text: "", location: "" });
          setMedia(null);
          setCreatedPost(await submit(data, media, token));
        }}
      >
        Post
      </button>
    </div>
  );
};

export default Form;
