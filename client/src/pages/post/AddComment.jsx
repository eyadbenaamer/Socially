import UserPicture from "components/UserPicture";
import { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as PhotoIcon } from "../../assets/icons/photo.svg";
import { PostContext } from "pages/post";
import { ReactComponent as AddCommentIcon } from "../../assets/icons/create-comment.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/cross.svg";

const AddComment = (props) => {
  const { type, commentId } = props;
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
    const requestUrl =
      type === "reply"
        ? `${API_URL}/posts/add_reply/${creatorId}/${postId}/${commentId}`
        : `${API_URL}/posts/add_comment/${creatorId}/${postId}`;
    fetch(requestUrl, {
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
      <div className="flex gap-2 items-center">
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
              placeholder={
                type === "reply" ? "Write a reply" : "Write a comment"
              }
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="flex gap-1">
              <input
                accept="video/*, video/x-m4v, video/webm, video/x-ms-wmv, video/x-msvideo, video/3gpp, video/flv, video/x-flv, video/mp4, video/quicktime, video/mpeg, video/ogv, .ts, .mkv, image/*, image/heic, image/heif"
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
                <AddCommentIcon />
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

export default AddComment;
