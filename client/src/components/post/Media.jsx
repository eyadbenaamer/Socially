import Dialog from "components/Dialog";
import { useState } from "react";

const Media = (props) => {
  const { media } = props;
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-5  max-w-full">
      <div className="slide flex radius h-[30vh] lg:h-[40vh] relative w-full overflow-hidden justify-center items-center">
        {index != media.length - 1 && (
          <div
            className="flex items-center justify-center absolute z-10 aspect-square bg-300 right-1 top-[50%] w-10 text-lg cursor-pointer"
            style={{ borderRadius: "50%" }}
            onClick={() => setIndex(index + 1)}
          >
            &gt;
          </div>
        )}
        {index != 0 && (
          <div
            className="flex items-center justify-center absolute z-10 aspect-square bg-300 left-1 top-[50%] w-10 text-lg cursor-pointer"
            style={{ borderRadius: "50%" }}
            onClick={() => setIndex(index - 1)}
          >
            &lt;
          </div>
        )}
        <div
          className="flex justify-center radius overflow-hidden"
          onClick={() => setIsOpen(true)}
        >
          {media[index].fileType === "photo" ? (
            <img src={media[index].path} className="cursor-pointer" />
          ) : (
            <video
              controls
              src={media[index].path}
              className="cursor-pointer"
            />
          )}
        </div>
        <Dialog isOpened={isOpen} setIsOpened={setIsOpen}>
          {media[index].fileType === "photo" ? (
            <img src={media[index].path} />
          ) : (
            <video controls src={media[index].path} />
          )}
        </Dialog>
      </div>
      {media.length > 1 && (
        <div className="bullets flex gap-1 my-0 mx-auto">
          {media.map((file, i) => {
            return (
              <div
                key={i}
                className={`bg-inverse w-[6px] aspect-square ${
                  i !== index ? " opacity-20" : ""
                }`}
                style={{ borderRadius: "50%" }}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Media;
