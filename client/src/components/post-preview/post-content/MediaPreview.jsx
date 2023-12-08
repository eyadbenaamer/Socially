const MediaPreview = (props) => {
  const { media } = props;
  return (
    <div className=" w- aspect-square bg-slate-200">
      {media && media.map((file) => {})}
    </div>
  );
};

export default MediaPreview;
