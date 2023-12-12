import { useContext, useEffect, useRef, useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import SubmitBtn from "./SubmitBtn";
import axios from "axios";
import { useSelector } from "react-redux";

const Text = (props) => {
  const [text, setText] = useState("");
  const {
    type,
    postCreatorId,
    postId,
    commentId,
    replyId,
    isModifying,
    setIsModifying,
  } = props;
  const textArea = useRef(null);
  const [modifiedText, setModifiedText] = useState(null);
  const [originalText, setOriginalText] = useState(props.text);
  const user = useSelector((state) => state.user);
  const editText = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    let requestUrl;
    if (type === "post") {
      requestUrl = `${API_URL}/posts/edit_post/${postCreatorId}/${postId}`;
    } else if (type === "comment") {
      requestUrl = `${API_URL}/posts/edit_comment/${postCreatorId}/${postId}/${commentId}/`;
    } else if (type === "reply") {
      requestUrl = `${API_URL}/posts/edit_reply/${postCreatorId}/${postId}/${commentId}/${replyId}`;
    }
    axios
      .patch(
        requestUrl,
        { text: modifiedText },
        { headers: { Authorization: user.token } }
      )
      .then((response) => {
        setOriginalText(response.data.text);
        setIsModifying(false);
      });
  };
  useEffect(() => {
    let text = originalText;
    if (text.length > 100) {
      setText(text.slice(0, 100).concat(" ..."));
    } else {
      setText(text);
    }
  }, [isModifying]);
  return (
    <>
      {isModifying ? (
        <>
          <textarea
            defaultValue={text}
            autoFocus
            ref={textArea}
            dir="auto"
            onChange={(e) =>
              setModifiedText(e.target.value.trimStart().trimEnd())
            }
          ></textarea>
          <div className="self-end flex gap-3">
            <span>
              <PrimaryBtn onClick={() => setIsModifying(false)}>
                Cancel
              </PrimaryBtn>
            </span>
            <span>
              <SubmitBtn
                disabled={!modifiedText || modifiedText === text}
                onClick={() => editText()}
              >
                Edit
              </SubmitBtn>
            </span>
          </div>
        </>
      ) : (
        <p dir="auto">
          {text}{" "}
          {text.length > 100 && originalText.length !== text.length && (
            <button
              className="cursor-pointer hover:underline"
              onClick={() => setText(originalText)}
            >
              show more
            </button>
          )}
          {text.length > 100 && text.length === originalText.length && (
            <button
              className="hover:underline"
              onClick={() => setText(originalText.slice(0, 100).concat(" ..."))}
            >
              show less
            </button>
          )}
        </p>
      )}
    </>
  );
};

export default Text;
