import Dialog from "components/dialog";
import { useState } from "react";

const Media = (props) => {
  const { children } = props;
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <div onClick={() => setIsOpened(true)}>{children}</div>
      <Dialog isOpened={isOpened} setIsOpened={setIsOpened}>
        {children}
      </Dialog>
    </>
  );
};

export default Media;
