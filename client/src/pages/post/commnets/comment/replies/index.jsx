import Reply from "./reply";

const Replies = (props) => {
  const { replies } = props;
  return (
    <>
      {replies.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          {replies.map((reply) => (
            <Reply key={reply._id} reply={reply} />
          ))}
        </div>
      )}
    </>
  );
};

export default Replies;
