import { useEffect, useRef, useState } from "react";

import ToggleButtons from "./ToggleButtons";

import { useWindowWidth } from "hooks/useWindowWidth";

import "./index.css";

const Slider = (props) => {
  const { files } = props;
  const slider = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const windowWidth = useWindowWidth();
  const [slideWidth, setSlideWidth] = useState(slider.current?.clientWidth);

  useEffect(() => {
    setSlideWidth(slider.current?.clientWidth);
  }, [windowWidth]);

  useEffect(() => {
    if (slider.current) {
      slider.current.addEventListener("scrollend", () => {
        const scroll = Math.round(slider.current.scrollLeft);
        if (scroll / slideWidth == Math.round(scroll / slideWidth)) {
          setCurrentSlide(Math.round(scroll / slideWidth));
        }
      });
      slider.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: "smooth",
      });
    }
  }, [slider.current?.clientWidth, currentSlide]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="relative w-full mx-auto">
          {windowWidth > 768 && (
            <ToggleButtons
              slidesCount={files?.length}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
            />
          )}
          <div ref={slider} className="slider w-full rounded-lg">
            <div className="w-max h-[40svh] sm:h-[500px]">
              {files?.map((file, i) => (
                <div
                  style={{ width: slideWidth }}
                  className="inline-block h-full"
                >
                  <div className="slide">
                    {file.fileType === "photo" ? (
                      <img src={file.path} alt={`media ${i + 1}`} />
                    ) : (
                      <video controls alt={`media ${i + 1}`} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {files?.length > 1 && (
        <div className="bullets flex gap-1 my-0 mx-auto">
          {files.map((flie, i) => {
            return (
              <div
                key={i}
                className={`bg-inverse w-[6px] aspect-square ${
                  i !== currentSlide ? " opacity-20" : ""
                }`}
                style={{ borderRadius: "50%" }}
              ></div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Slider;
