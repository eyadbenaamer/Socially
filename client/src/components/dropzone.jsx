import { useState, useRef } from "react";

const DropZone = ({ onChange, multiple }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState(null);
  const input = useRef(null);
  return (
    <>
      <input
        type="file"
        name="media"
        ref={input}
        accept="video/*, video/x-m4v, video/webm, video/x-ms-wmv, video/x-msvideo, video/3gpp, video/flv, video/x-flv, video/mp4, video/quicktime, video/mpeg, video/ogv, .ts, .mkv, image/*, image/heic, image/heif"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          if (multiple) {
            onChange([...e.target.files]);
            setFiles([...e.target.files]);
          } else {
            onChange(e.target.files[0]);
            setFiles(e.target.files[0]);
          }
        }}
      />
      <p
        onClick={(e) => input.current.click()}
        style={{ display: "", background: "#eee", padding: "100px" }}
        // onDragEndCapture={(e) => { //TODO:search for a way to implement the drop function
        //   setIsDragging(false);
        // }}
        onDragOver={() => {
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
      >
        {!files &&
          (isDragging ? (
            <>Drop the files here ...</>
          ) : (
            <>Drag 'n' drop some files here, or click to select files</>
          ))}
        {/* {files && <>{files.map((file) => file.name)}</>} */}
      </p>
    </>
  );
};
export default DropZone;
