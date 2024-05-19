import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

import Slider from "./slider";

import CreatorInfo from "./post/post-content/CreatorInfo";

const SharedPost = (props) => {
  const { _id: id, creatorId } = props.post;
  const theme = useSelector((state) => state.settings.theme);
  const [post, setPost] = useState(null);
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    axios
      .get(`${API_URL}/post?userId=${creatorId}&postId=${id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setPost({ status: "not found" });
        }
      });
  }, []);
  return (
    <div
      className={`shared-post flex flex-col gap-4 bg-200 w-full py-3 ${
        theme === "light" ? "border" : ""
      }`}
    >
      {post?._id && (
        <div className="scale-95">
          <div className="flex justify-between px-2">
            <CreatorInfo
              creatorId={creatorId}
              createdAt={post.createdAt}
              location={post.location}
              postId={id}
            />
          </div>
          <div className="px-1 sm:px-4 flex flex-col gap-3">
            <div className="p-1 mt-5">{post.text}</div>
          </div>
          {post.files?.length > 0 && <Slider files={post.files} />}
        </div>
      )}
      {post?.status == "not found" && (
        <div className="bg-100 p-4 rounded-md m-1">
          This content is not available.
        </div>
      )}
    </div>
  );
};

export default SharedPost;
