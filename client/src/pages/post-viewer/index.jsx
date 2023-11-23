import Post from "components/post";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./commnets";
import CreateComment from "components/post/CreateComment";

const PostViewer = () => {
  const { userId, postId } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;

    fetch(`${API_URL}/posts/${userId}/${postId}`).then((response) =>
      response.json().then((response) => {
        setPost(response);
        setComments(response.comments);
      })
    );
  }, []);
  const [comments, setComments] = useState(post ? post.comments : []);
  return (
    <>
      <div className="p-2 w-full md:w-1/2 my-0 mx-auto ">
        {post && (
          <Post post={post}>
            <Comments comments={comments} />
          </Post>
        )}
      </div>
    </>
  );
};

export default PostViewer;
