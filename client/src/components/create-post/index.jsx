import { Link } from "react-router-dom";
import { ReactComponent as PhotoIcon } from "../../assets/icons/photo.svg";
import { ReactComponent as VideoIcon } from "../../assets/icons/video.svg";

import { useSelector } from "react-redux";
import Prompt from "components/Prompt";
import { useRef, useState } from "react";
import Form from "./form";
import UserPicture from "components/UserPicture";

const CreatePost = ({ setCreatedPost }) => {
  const user = useSelector((state) => state.user);
  const [isOpened, setIsOpened] = useState(false);
  const [data, setData] = useState({ text: "", location: "" });
  const [media, setMedia] = useState(null);

  return (
    <section className="create-post bg-200 w-full px-4 pt-5 pb-1 radius flex flex-col gap-3">
      <div className="flex gap-3 items-center">
        <UserPicture
          to={`/profile/${user._id}`}
          src={user.picturePath}
          alt={`${user.firstName} ${user.lastName}`}
        />
        <div
          onClick={() => setIsOpened(!isOpened)}
          className="cursor-pointer h-[2.75rem] text-ellipsis overflow-clip radius bg-300 p-2 w-full shadow-md"
          style={{ lineHeight: 2 }}
        >
          {data.text || "Type Anything!"}
        </div>
      </div>
      <div className="flex items-center">
        <div
          onClick={() => setIsOpened(!isOpened)}
          className="icon text-hovered p-3 flex items-center gap-3 cursor-pointer w-full justify-center"
        >
          <PhotoIcon width={32} /> Photo
        </div>
        <span width={1} className={`bg-inverse h-7 w-[2px] opacity-20`}></span>
        <div
          onClick={() => setIsOpened(!isOpened)}
          className="icon text-hovered p-3 flex items-center gap-3 cursor-pointer w-full justify-center"
        >
          <VideoIcon width={32} /> Video
        </div>
        <Prompt isOpened={isOpened} setIsOpened={setIsOpened}>
          <Form
            setIsOpened={setIsOpened}
            data={data}
            setData={setData}
            media={media}
            setMedia={setMedia}
            setCreatedPost={setCreatedPost}
          />
        </Prompt>
      </div>
    </section>
  );
};

export default CreatePost;
