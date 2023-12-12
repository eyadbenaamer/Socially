import { useEffect, useRef } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/cross.svg";
import useCloseWidget from "hooks/useCloseWidget";
const Dialog = (props) => {
  const { isOpened, setIsOpened, children } = props;

  const prompt = useRef(null);
  useCloseWidget(prompt, setIsOpened);
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
        aria-busy={true}
        className="text-inherit w-full fixed top-0 bg-[#00000063] h-[100vh] flex items-center justify-center z-50"
      >
        <div ref={prompt}>
          <section className="dialog bg-200 px-4 py-3 w-fit h-fit radius ">
            <button
              className="cursor-pointer w-5"
              onClick={() => setIsOpened(!isOpened)}
            >
              <CloseIcon className="hover:text-white" />
            </button>
            <>{children}</>
          </section>
        </div>
      </dialog>
    )
  );
};

export default Dialog;
