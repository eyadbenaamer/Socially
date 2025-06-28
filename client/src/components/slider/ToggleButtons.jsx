import { ReactComponent as NextIcon } from "assets/icons/arrow-right.svg";
import { ReactComponent as PrevIcon } from "assets/icons/arrow-left.svg";

const ToggleButtons = (props) => {
  const { currentSlide, setCurrentSlide, slidesCount } = props;

  return (
    <>
      {slidesCount > 1 && (
        <>
          {currentSlide > 0 && (
            <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center group">
              <button
                aria-label="previous"
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className="opacity-0 group-hover:opacity-100 transition w-9 h-9 circle bg-200"
              >
                <PrevIcon fill="currentColor" />
              </button>
            </div>
          )}
          {currentSlide !== slidesCount - 1 && (
            <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center group">
              <button
                aria-label="next"
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="opacity-0 group-hover:opacity-100 transition w-9 h-9 circle bg-200"
              >
                <NextIcon fill="currentColor" />
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ToggleButtons;
