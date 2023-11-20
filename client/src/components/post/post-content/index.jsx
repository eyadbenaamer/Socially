import MediaPreview from "./MediaPreview";
import Text from "./Text";

const PostContent = (props) => {
  const { media, text } = props;
  return (
    <div className="p-4">
      <Text text={text} />
      {media && <MediaPreview media={media} />}
    </div>
  );
};

export default PostContent;
