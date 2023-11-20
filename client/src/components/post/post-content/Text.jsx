import { useEffect, useState } from "react";

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
  return (
    <div className="py-3">
      <p>{text}</p>
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
          className="cursor-pointer hover:underline"
          onClick={() => setText(text.slice(0, 100).concat(" ..."))}
        >
          show less
        </button>
      )}
    </div>
  );
};

export default Text;
