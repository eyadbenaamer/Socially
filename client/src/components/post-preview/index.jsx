import PostContent from "./post-content";
import ReactionsBar from "./reactions-bar";
import useFetchUser from "hooks/useFetchUser";
import { useState } from "react";

const PostPreview = (props) => {
  const {
    post: { _id, creatorId, files, text, createdAt, location, likes },
  } = props;
  const [user] = useFetchUser(creatorId);
  const [comments] = useState(props.post.comments);
  return (
    <div className="flex flex-col gap-4 bg-200 radius w-full py-3 shadow-sm">
      <PostContent
        id={_id}
        user={user}
        createdAt={createdAt}
        location={location}
        text={text}
        media={files}
      />
      <ReactionsBar
        id={_id}
        creatorId={creatorId}
        commentsCount={comments.length}
        likes={likes}
      />
    </div>
  );
};

export default PostPreview;
