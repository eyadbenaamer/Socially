import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import PrimaryBtn from "./PrimaryBtn";
import SubmitBtn from "./SubmitBtn";

import axiosClient from "utils/AxiosClient";

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
  const profile = useSelector((state) => state.profile);

  const editText = async () => {
    const API_URL = process.env.REACT_APP_APP_URL;
    let requestUrl;
    if (type === "post") {
      requestUrl = `${API_URL}/post/edit?userId=${postCreatorId}&postId=${postId}`;
    } else if (type === "comment") {
      requestUrl = `${API_URL}/comment/edit?userId=${postCreatorId}&postId=${postId}&commentId=${commentId}`;
    } else if (type === "reply") {
      requestUrl = `${API_URL}/reply/edit?userId=${postCreatorId}&postId=${postId}&commentId=${commentId}&replyId=${replyId}`;
    }
    axiosClient
      .patch(
        requestUrl,
        { text: modifiedText },
        { headers: { Authorization: profile.token } }
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
