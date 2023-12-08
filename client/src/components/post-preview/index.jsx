import PostContent from "./post-content";
import ReactionsBar from "./reactions-bar";
import useFetchUser from "hooks/useFetchUser";
import { createContext, useState } from "react";

export const PostContext = createContext();
const PostPreview = (props) => {
  const [post, setPost] = useState(props.post);
  const [user] = useFetchUser(post.creatorId);
  return (
    <PostContext.Provider value={{ ...post, setPost, user }}>
      <div
        className={`flex flex-col gap-4 bg-200 radius w-full py-3 shadow-sm`}
      >
        <PostContent />
        <ReactionsBar />
      </div>
    </PostContext.Provider>
  );
};

export default PostPreview;
