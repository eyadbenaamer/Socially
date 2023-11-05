// axios
//   .post("https://v2.convertapi.com/upload", formData, {
//     onUploadProgress: (progressEvent) => {
//       const percentage = Math.round(
//         (progressEvent.loaded * 100) / progressEvent.total
//       );
//       percentLoader.open({ percentage, speed: 20 });
//     },
//   })
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((error) => console.log(error));
import { useState, useRef } from "react";

export default () => {
  const [file, setFile] = useState();
  const uploadRef = useRef();
  const statusRef = useRef();
  const loadTotalRef = useRef();
  const progressRef = useRef();

  const UploadFile = () => {
    const file = uploadRef.current.files[0];
    setFile(URL.createObjectURL(file));
    var formData = new FormData();
    formData.append("image", file);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", ProgressHandler, false);
    xhr.addEventListener("load", SuccessHandler, false);
    xhr.addEventListener("error", ErrorHandler, false);
    xhr.addEventListener("abort", AbortHandler, false);
    xhr.open("POST", "fileupload.php");
    xhr.send(formData);
  };

  const ProgressHandler = (e) => {
    loadTotalRef.current.innerHTML = `uploaded ${e.loaded} bytes of ${e.total}`;
    var percent = (e.loaded / e.total) * 100;
    progressRef.current.value = Math.round(percent);
    statusRef.current.innerHTML = Math.round(percent) + "% uploaded...";
  };

  const SuccessHandler = (e) => {
    statusRef.current.innerHTML = e.target.responseText;
    progressRef.current.value = 0;
  };
  const ErrorHandler = () => {
    statusRef.current.innerHTML = "upload failed!!";
  };
  const AbortHandler = () => {
    statusRef.current.innerHTML = "upload aborted!!";
  };

  return (
    <div className="App">
      <input type="file" name="file" ref={uploadRef} onChange={UploadFile} />
      <label>
        File progress: <progress ref={progressRef} value="0" max="100" />
      </label>
      <p ref={statusRef}></p>
      <p ref={loadTotalRef}></p>
      <img src={file} alt="" style={{ width: "300px", height: "100px" }} />
    </div>
  );
};
