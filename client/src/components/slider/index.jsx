import { useState, useEffect } from "react";

import ToggleButtons from "./ToggleButtons";

import "./index.css";

const Slider = (props) => {
  const { files } = props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadingStates, setLoadingStates] = useState({});

  const file = files[currentSlide];

  // Set up loading state for all images on files change
  useEffect(() => {
    if (!files || files.length === 0) return;
    const initialLoadingStates = {};
    files.forEach((file, index) => {
      if (file.fileType === "photo") {
        initialLoadingStates[index] = true;
      }
    });
    setLoadingStates(initialLoadingStates);
  }, [files]);

  // Load current, previous, and next images when currentSlide changes
  useEffect(() => {
    if (!files || files.length === 0) return;
    const indicesToLoad = [currentSlide];
    if (currentSlide > 0) indicesToLoad.push(currentSlide - 1);
    if (currentSlide < files.length - 1) indicesToLoad.push(currentSlide + 1);

    indicesToLoad.forEach((index) => {
      const file = files[index];
      if (file && file.fileType === "photo") {
        setLoadingStates((prev) => ({ ...prev, [index]: true }));
        const img = new Image();
        img.onload = () => {
          setLoadingStates((prev) => ({ ...prev, [index]: false }));
        };
        img.onerror = () => {
          setLoadingStates((prev) => ({ ...prev, [index]: false }));
        };
        img.src = file.path;
      }
    });
  }, [currentSlide, files]);

  return (
    <>
      <div className="relative w-full rounded-2xl overflow-hidden h-[30svh] sm:h-[420px] flex justify-center items-center mb-3">
        <ToggleButtons
          slidesCount={files?.length}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
        />

        {/* Loading effect for current slide */}
        {loadingStates[currentSlide] && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <div className="loading-shimmer w-full h-full"></div>
          </div>
        )}

        {!loadingStates[currentSlide] && file.fileType === "photo" && (
          <img
            className="w-full rounded-2xl"
            loading="lazy"
            src={file.path}
            alt={`media ${currentSlide + 1}`}
          />
        )}
        {!loadingStates[currentSlide] && file.fileType === "video" && (
          <video controls alt={`media ${currentSlide + 1}`} />
        )}
      </div>

      {files?.length > 1 && (
        <div className="bullets w-fit flex gap-1 my-0 mx-auto">
          {files.map((flie, i) => {
            return (
              <div
                key={i}
                className={`bg-inverse w-[6px] aspect-square ${
                  i !== currentSlide ? " opacity-20" : ""
                } ${loadingStates[i] ? "animate-pulse" : ""}`}
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
