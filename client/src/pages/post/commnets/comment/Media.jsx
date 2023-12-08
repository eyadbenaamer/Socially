import Dialog from "components/Dialog";
import { useState } from "react";

const Media = (props) => {
  const { children } = props;
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <div onClick={() => setIsOpened(!isOpened)}>
        {children}
        <Dialog isOpened={isOpened} setIsOpened={setIsOpened}>
          {children}
        </Dialog>
      </div>
    </>
  );
};

export default Media;
