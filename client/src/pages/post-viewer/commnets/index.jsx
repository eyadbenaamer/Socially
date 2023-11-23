import Comment from "./Comment";

const Comments = (props) => {
  const { comments } = props;
  return (
    <div className="flex flex-col gap-5 border-t-[#ffffff1a] border-t p-3">
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      ) : (
        <>No comments yet.</>
      )}
    </div>
  );
};

export default Comments;
