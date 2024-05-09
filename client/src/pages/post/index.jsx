import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Bar from "components/bar";
import { useWindowWidth } from "hooks/useWindowWidth";
import { useSelector } from "react-redux";
import NotFound from "pages/NotFound";
import { Post as PostComponent } from "components/post";

const Post = () => {
  const { userId, postId } = useParams();
  const [post, setPost] = useState(null);
  const windowWidth = useWindowWidth();
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/post?userId=${userId}&postId=${postId}`).then(
      (response) => {
        if (response.status === 200) {
          response.json().then((response) => {
            setPost(response);
          });
        } else {
          setPost("not found");
        }
      }
    );
  }, []);

  const user = useSelector((state) => state.user);
  return (
    <>
      {post === "not found" ? (
        <NotFound />
      ) : (
        <div className="container min-h-screen pt-5 px-2 pb-28">
          {post && <PostComponent post={post} showComments={true} />}
        </div>
      )}
      {windowWidth <= 768 && user && <Bar />}
    </>
  );
};

export default Post;
