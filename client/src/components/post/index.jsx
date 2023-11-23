import axios from "axios";
import PostContent from "./post-content";
import { useState } from "react";
import UpperPart from "./upper-part";
import ReactionBar from "./reaction-bar";
import useFetchUser from "hooks/useFetchUser";
import CreateComment from "./CreateComment";

const Post = (props) => {
  const {
    post: {
      _id,
      creatorId,
      files,
      text,
      isCommentsDisables,
      createdAt,
      location,
      likes,
    },
    children,
  } = props;
  const [user, setUser] = useFetchUser(creatorId);
  const [comments, setComments] = useState(props.post.comments);
  return (
    <div className="flex flex-col gap-4 bg-200 radius w-full py-3  shadow-sm">
      <PostContent
        id={_id}
        user={user}
        createdAt={createdAt}
        location={location}
        text={text}
        media={files}
      />
      <ReactionBar
        id={_id}
        creatorId={creatorId}
        commentsCount={comments.length}
        likes={likes}
      />
      {children}
      {!isCommentsDisables && <CreateComment setComments={setComments} />}
    </div>
  );
};

export default Post;
