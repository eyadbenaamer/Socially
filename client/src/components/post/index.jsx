const Post = ({ data }) => {
  const { _id, userId, files, text, createdAt, location } = data;
  return (
    <div>
      {text}
      {files && <img src={files.photos[0]} alt="" />}
      {files && <video src={files.videos[0]} controls alt="" />}
    </div>
  );
};

export default Post;
