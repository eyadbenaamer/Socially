import { useEffect, useRef } from "react";

import { ReactComponent as CloseIcon } from "assets/icons/cross.svg";

const Dialog = (props) => {
  const { isOpened, setIsOpened, children } = props;

  const prompt = useRef(null);

  useEffect(() => {
    if (isOpened) {
      if (document.body.clientWidth > 768) {
        // adjust the width when the scrollbar is hidden due to the dialog only in non-mobile screens
        document.body.style.width = "calc(100% - 8px)";
      }
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
        <section className="dialog py-2 bg-200 h-fit max-h-[100dvh] rounded-xl">
          <button
            className="ms-3 cursor-pointer w-5"
            onClick={() => setIsOpened(!isOpened)}
          >
            <CloseIcon className="icon-hover hover:text-white" />
          </button>
          <div className="dialog max-h-[90vh] overflow-y-scroll">
            {children}
          </div>
        </section>
      </dialog>
    )
  );
};

export default Dialog;
