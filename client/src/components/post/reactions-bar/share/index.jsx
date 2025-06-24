import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Form from "./form";
import Dialog from "components/dialog";

import { useWindowWidth } from "hooks/useWindowWidth";

import { ReactComponent as ShareIcon } from "assets/icons/share.svg";

const Share = () => {
  const windowWidth = useWindowWidth();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profile);
  const [data, setData] = useState({ text: "", location: "" });
  const [media, setMedia] = useState([]);
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <button
        className="flex w-auto justify-center gap-1 items-center hover:text-[var(--primary-color)] transition"
        onClick={() => {
          if (profile) {
            setIsOpened(true);
          } else {
            navigate("/login");
          }
        }}
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
