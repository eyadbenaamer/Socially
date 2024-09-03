import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { Post as PostComponent } from "components/post";
import Bar from "components/bar";
import NotFound from "pages/NotFound";

import { useWindowWidth } from "hooks/useWindowWidth";

import axiosClient from "utils/AxiosClient";

const Post = () => {
  const [post, setPost] = useState(null);
  const user = useSelector((state) => state.profile);
  const { userId, postId } = useParams();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    axiosClient(`post?userId=${userId}&postId=${postId}`).then((response) => {
      if (response.status === 200) {
        setPost(response.data);
      } else {
        setPost("not found");
      }
    });
  }, []);

  return (
    <>
      {post === "not found" ? (
        <NotFound />
      ) : (
        <div className="container min-h-screen pt-5 px-2 pb-28">
          {post && <PostComponent post={post} showComments={true} />}
        </div>
      )}
      {windowWidth < 768 && user && <Bar />}
    </>
  );
};

export default Post;
