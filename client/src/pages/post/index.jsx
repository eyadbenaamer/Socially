import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Post as PostComponent } from "components/post";
import NotFound from "pages/NotFound";

import axiosClient from "utils/AxiosClient";

const Post = () => {
  const [post, setPost] = useState(null);
  const [searchParams] = useSearchParams();

  const postId = searchParams.get("_id");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosClient(`post?postId=${postId}`);
        setPost(response.data);
      } catch (error) {
        setPost("not found");
      }
    };

    fetchPost();
  }, [postId]);

  if (post === "not found") {
    return <NotFound />;
  }

  return (
    <div className="container lg:w-1/2 md:w-2/3 pt-5 px-2 pb-28">
      {post && <PostComponent post={post} showComments />}
    </div>
  );
};

export default Post;
