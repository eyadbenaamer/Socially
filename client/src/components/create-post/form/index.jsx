import { useContext, useState } from "react";

import DropZone from "components/dropzone";
import { PostsContext } from "components/posts";
import axiosClient from "utils/AxiosClient";
import SubmitBtn from "components/SubmitBtn";

const Form = (props) => {
  const { data, setData, setIsOpened } = props;
  const { posts, setPosts } = useContext(PostsContext);
  const [media, setMedia] = useState([]);

  const submit = async () => {
    const formData = new FormData();
    for (const property in data) {
      formData.append(property, data[property]);
    }
    if (media) {
      for (const file in media) {
        formData.append("media", media[file]);
      }
    }
    await axiosClient.post(`post/create`, formData).then((response) => {
      if (posts) {
        setPosts([response.data, ...posts]);
      } else {
        setPosts(response.data);
      }
    });
  };

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
      <SubmitBtn
        disabled={!(data.text || media.length > 0)}
        onClick={async () => {
          await submit();
          setData({ text: "", location: "" });
          setMedia([]);
          setIsOpened(false);
        }}
      >
        Post
      </SubmitBtn>
    </div>
  );
};

export default Form;
