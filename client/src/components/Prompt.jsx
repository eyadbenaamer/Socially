import { useEffect } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/cross.svg";
const Prompt = (props) => {
  const { isOpened, setIsOpened, children } = props;
  useEffect(() => {
    if (isOpened) {
      window.scrollTo({ top: 0 });
      document.querySelector("html").style.height = window.innerHeight;
      document.querySelector("html").style.overflow = "hidden";
    } else {
      document.querySelector("html").style = null;
    }
  }, [isOpened]);
  return (
    isOpened && (
      <div className=" absolute left-0 w-full h-[200%] flex items-center justify-center z-10">
        <div className="overlay absolute w-full h-[100%] bg-black opacity-40 "></div>
        <div className="w-full sm:w-[600px] ">
          <section className="relative prompt bg-200 w-full sm:w-[600px] z-20 px-4 py-3 ">
            <div
              className="cursor-pointer w-5"
              onClick={() => setIsOpened(false)}
            >
              <CloseIcon className="hover:text-white" />
            </div>
            {children}
          </section>
        </div>
      </div>
    )
  );
};

export default Prompt;
