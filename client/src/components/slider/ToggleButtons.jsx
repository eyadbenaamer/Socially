import { ReactComponent as NextIcon } from "assets/icons/arrow-right.svg";
import { ReactComponent as PrevIcon } from "assets/icons/arrow-left.svg";
const ToggleButtons = (props) => {
  const { currentSlide, setCurrentSlide, slidesCount } = props;
  return (
    <>
      {slidesCount > 1 && (
        <>
          {currentSlide > 0 && (
            <button
              aria-label="previous"
              onClick={() => setCurrentSlide(currentSlide - 1)}
              className="absolute left-2 top-1/2 -translate-y-1.5 w-9 circle bg-200"
            >
              <PrevIcon fill="currentColor" />
            </button>
          )}
          {currentSlide !== slidesCount - 1 && (
            <button
              aria-label="next"
              onClick={() => setCurrentSlide(currentSlide + 1)}
              className="absolute right-2 top-1/2 -translate-y-1.5 w-9 circle bg-200"
            >
              <NextIcon fill="currentColor" />
            </button>
          )}
        </>
      )}
    </>
  );
};

export default ToggleButtons;
