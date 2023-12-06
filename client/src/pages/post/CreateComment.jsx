import UserPicture from "components/UserPicture";
import { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as PhotoIcon } from "../../assets/icons/photo.svg";
import { PostContext } from "pages/post";
import { ReactComponent as CreateCommentIcon } from "../../assets/icons/create-comment.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/cross.svg";

const CreateComment = (props) => {
  const { setPost, _id: postId, creatorId } = useContext(PostContext);
  const user = useSelector((state) => state.user);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const mediaBtn = useRef(null);

  const addComment = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const formData = new FormData();
    formData.append("text", text);
    media && formData.append("media", media);
    fetch(`${API_URL}/posts/add_comment/${creatorId}/${postId}`, {
      method: "POST",
      body: formData,
      headers: { Authorization: user.token },
    })
      .then((response) =>
        response.json().then((response) => {
          setPost(response);
        })
      )
      .catch((err) => {});
  };
  const [file, setFile] = useState(null);
  return (
    <div className=" px-4 py-3">
      <div className="flex gap-3 items-start">
        <UserPicture
          id={user._id}
          src={user.picturePath}
          name={`${user.firstName} ${user.lastName}`}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between bg-300 py-2 px-2 radius shadow-sm">
            <textarea
              value={text}
              dir="auto"
              className="comment-input h-6 w-3/4"
              placeholder="Write a comment"
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="flex gap-1">
              <input
                style={{ display: "none" }}
                type="file"
                ref={mediaBtn}
                onChange={(e) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(e.target.files[0]);
                  reader.addEventListener("load", (e) =>
                    setFile(e.currentTarget.result)
                  );
                  setMedia(e.target.files[0]);
                }}
              />
              <button
                aria-label="add a photo or a video"
                className="w-7  circle p-[2px] outline-none text-hovered transition focus:[text-hovered]"
                onClick={() => mediaBtn.current.click()}
              >
                <PhotoIcon />
              </button>
              <button
                aria-label="send the comment"
                disabled={!(text || media)}
                className={`w-8 text-white stroke-white p-1 ${
                  !(text || media) ? "opacity-30" : "text-hovered"
                }`}
                onClick={() => {
                  addComment();
                  setMedia(null);
                  setFile(null);
                  setText("");
                }}
              >
                <CreateCommentIcon />
              </button>
            </div>
          </div>
          {file && (
            <div className="w-32">
              <button
                className="w-5"
                onClick={() => {
                  setMedia(null);
                  setFile(null);
                }}
              >
                <CloseIcon />
              </button>
              <div className="radius overflow-hidden">
                {media.type.startsWith("image") ? (
                  <img src={file} />
                ) : (
                  <video src={file} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
