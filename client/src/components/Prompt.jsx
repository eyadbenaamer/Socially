import { useEffect, useRef } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/cross.svg";
import useCloseWidget from "hooks/useCloseWidget";
const Prompt = (props) => {
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
  return (
    isOpened && (
      <div
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsOpened(false);
          }
        }}
        className=" absolute left-0 w-full h-[100vh] stop-[-62px] flex items-center justify-center z-10"
        style={{ top: window.scrollY - 62 }}
      >
        <div className="overlay absolute w-full h-[100%] bg-black opacity-40 "></div>
        <div ref={prompt}>
          <section className="relative prompt bg-200  z-20 px-4 py-3 w-fit h-fit radius ">
            <div
              className="cursor-pointer w-5"
              onClick={() => setIsOpened(false)}
            >
              <CloseIcon className="hover:text-white" />
            </div>
            <>{children}</>
          </section>
        </div>
      </div>
    )
  );
};

export default Prompt;
