const LoadingNotification = () => {
  return (
    <div className="flex flex-col px-2 gap-2">
      <div className="user-info py-2 w-fit flex gap-2">
        <div className="circle w-12 loading"></div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="h-3 loading rounded-xl w-[200px]"></div>
        </div>
      </div>
      <div className="user-info w-fit flex gap-2">
        <div className="circle w-12 loading"></div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="h-3 loading rounded-xl w-[200px]"></div>
        </div>
      </div>
      <div className="user-info w-fit flex gap-2">
        <div className="circle w-12 loading"></div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="h-3 loading rounded-xl w-[200px]"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingNotification;
