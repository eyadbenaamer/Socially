// TODO: Fix close by click outside of the component
import { useEffect, useRef } from "react";

import { ReactComponent as CloseIcon } from "assets/icons/cross.svg";
import useCloseWidget from "hooks/useCloseWidget";
import { useLocation } from "react-router-dom";

const Dialog = (props) => {
  const { isOpened, setIsOpened, children } = props;
  const { pathname } = useLocation();
  const prompt = useRef(null);

  useCloseWidget(prompt, setIsOpened);

  useEffect(() => {
    if (isOpened) {
      /*
      adjust the width when the scrollbar is hidden due to the dialog only 
      in non-mobile screens and anywhere exepct in "messages" route
      */
      if (
        document.body.clientWidth > 768 &&
        !pathname.startsWith("/messages")
      ) {
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

  if (!isOpened) return null;

  return (
    <dialog
      ref={prompt}
      aria-busy={true}
      className="p-3 ps-1 text-inherit w-full fixed top-0 bg-[#00000063] h-[100dvh] flex items-center justify-center z-[1150]"
    >
      <section className="dialog py-2 bg-200 h-fit max-h-[100dvh] rounded-xl">
        <button
          className="ms-3 cursor-pointer w-5"
          onClick={() => setIsOpened(!isOpened)}
        >
          <CloseIcon className="icon-hover hover:text-white" />
        </button>
        <div className="dialog max-h-[90vh] overflow-y-scroll ps-2 py-2">
          {children}
        </div>
      </section>
    </dialog>
  );
};

export default Dialog;
