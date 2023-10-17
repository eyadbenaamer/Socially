import { useState, useRef } from "react";

const DropZone = ({ onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const input = useRef(null);
  return (
    <>
      <input
        type="file"
        name="picture"
        ref={input}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          onChange(file);
          setFile(file);
        }}
      />
      <p
        onClick={(e) => input.current.click()}
        style={{ display: "", background: "#eee", padding: "100px" }}
        // onDragEndCapture={(e) => { //TODO:search for a way to implement the drop function
        //   console.log(e.dataTransfer.files);
        //   setIsDragging(false);
        // }}
        onDragOver={() => {
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
      >
        {!file &&
          (isDragging ? (
            <>Drop the files here ...</>
          ) : (
            <>Drag 'n' drop some files here, or click to select files</>
          ))}
        {file && <>{file.name}</>}
      </p>
    </>
  );
};
export default DropZone;
