import { ReactComponent as NotFoundPicture } from "assets/not-found.svg";

const NotFound = () => {
  return (
    <div
      className="container flex flex-col items-center p-3 text-2xl text-center justify-center"
      style={{ height: "calc(100vh - 45px)" }}
    >
      <div className="w-full min-[425px]:w-[400px] sm:w-[500px] text-[transparent]">
        <NotFoundPicture />
      </div>
      <div className="py-14">
        This content is either not available or not exist.
      </div>
    </div>
  );
};

export default NotFound;
