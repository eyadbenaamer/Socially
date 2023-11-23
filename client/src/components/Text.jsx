import { useContext, useEffect, useRef, useState } from "react";

const Text = (props) => {
  const [text, setText] = useState("");
  useEffect(() => {
    let text = props.text;
    if (props.text.length > 100) {
      setText(text.slice(0, 100).concat(" ..."));
    } else {
      setText(text);
    }
  }, []);
  const { isModifying, setModifiedText, textArea } = props;
  return (
    <>
      {isModifying ? (
        <p>
          <textarea
            ref={textArea}
            dir="auto"
            defaultValue={props.text}
            onChange={(e) => setModifiedText(e.target.value)}
          ></textarea>
        </p>
      ) : (
        <p dir="auto">
          {text}
          {props.text.length > 100 && text.length !== props.text.length && (
            <button
              className="cursor-pointer hover:underline"
              onClick={() => setText(props.text)}
            >
              show more
            </button>
          )}
          {props.text.length > 100 && text.length === props.text.length && (
            <button
              className="hover:underline"
              onClick={() => setText(text.slice(0, 100).concat(" ..."))}
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
