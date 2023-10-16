import { useState, useRef } from "react";
const Input = () => {
  const [drag, setDrag] = useState(false);
  const input = useRef(null);
  return (
    <>
      <input type="file" ref={input} style={{ display: "none" }} />
      <div
        onClick={(e) => {
          input.current.click();
        }}
        onDragEndCapture={(e) => {
          console.log(e.dataTransfer.files);
          setDrag(false);
        }}
        style={{ display: "", background: "#eee", padding: "100px" }}
        onDragOver={() => {
          setDrag(true);
        }}
        onDragLeave={() => {
          setDrag(false);
        }}
      >
        {drag ? (
          <>Drop the files here ...</>
        ) : (
          <>Drag 'n' drop some files here, or click to select files</>
        )}
      </div>
    </>
  );
};

export default Input;
