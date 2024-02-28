const CoverPicture = (props) => {
  const { coverPath, avatarPath } = props;
  return (
    <div className="relative mx-1 sm:mx-4 mb-[100px]">
      <div
        className="cover-image-container bg-200 h-[200px] w-full"
        style={{
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <img
          loading="lazy"
          className=" max-h-full w-full radius"
          src={coverPath}
        />
      </div>
      <div className="avatar-image-container absolute bottom-[-50%] left-8 circle w-32 sm:w-48 border-2 bg-300">
        <img
          loading="lazy"
          className=" max-h-full w-full radius "
          src={avatarPath}
        />
      </div>
    </div>
  );
};

export default CoverPicture;
