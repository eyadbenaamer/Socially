import { useEffect, useState } from "react";
import { submit } from "./submit";
import { useSelector } from "react-redux";

const Form = () => {
  const [isValidPost, setIsValidPost] = useState(false);
  const [data, setData] = useState({ text: null, photo: null, vedio: null });
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (data.text || data.photo || data.vedio) {
      setIsValidPost(true);
    } else {
      setIsValidPost(false);
    }
  }, [data]);
  return (
    <div className="flex flex-col">
      <textarea
        className="mt-2"
        type="text"
        name="text"
        placeholder="Type Anything!"
        onChange={(e) => {
          setData((prev) => ({ ...prev, text: e.target.value }));
        }}
      />
      <button
        disabled={!isValidPost}
        className={`${
          isValidPost ? "bg-primary" : "bg-secondary"
        } self-end py-2 px-4 radius`}
        onClick={async () => await submit(data, token)}
      >
        Post
      </button>
    </div>
  );
};

export default Form;
