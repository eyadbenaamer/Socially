import { useState } from "react";

import Form from "./form";
import Dialog from "components/dialog";

import { useWindowWidth } from "hooks/useWindowWidth";

import { ReactComponent as ShareIcon } from "assets/icons/share.svg";

const Share = () => {
  const windowWidth = useWindowWidth();
  const [data, setData] = useState({ text: "", location: "" });
  const [media, setMedia] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <button
        className="flex w-auto justify-center gap-1 items-center hover:text-[var(--primary-color)] transition"
        onClick={() => setIsOpened(true)}
      >
        <div className="w-6">
          <ShareIcon />
        </div>
        {windowWidth > 400 && <span>Share</span>}
      </button>
      <Dialog isOpened={isOpened} setIsOpened={setIsOpened}>
        <Form
          setIsOpened={setIsOpened}
          data={data}
          setData={setData}
          media={media}
          setMedia={setMedia}
        />
      </Dialog>
    </>
  );
};
export default Share;
