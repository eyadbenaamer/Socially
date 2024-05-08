import { useEffect, useRef } from "react";

import "./index.css";
import { ReactComponent as CloseIcon } from "assets/icons/cross.svg";

const Dialog = (props) => {
  const { isOpened, setIsOpened, children } = props;

  const prompt = useRef(null);
  useEffect(() => {
    if (isOpened) {
      document.body.style.height = "100vh";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style = null;
    }
  }, [isOpened]);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setIsOpened(false);
    }
  });
  return (
    isOpened && (
      <dialog
        ref={prompt}
        aria-busy={true}
        className="text-inherit w-full fixed top-0 bg-[#00000063] h-[100dvh] flex items-center justify-center z-[100]"
      >
        <section className="dialog bg-200 px-4 py-3 h-fit max-h-[100dvh]">
          <button
            className="cursor-pointer w-5"
            onClick={() => setIsOpened(!isOpened)}
          >
            <CloseIcon className="icon hover:text-white" />
          </button>
          <div className="dialog max-h-[90vh] overflow-y-scroll p-1">
            {children}
          </div>
        </section>
      </dialog>
    )
  );
};

export default Dialog;
