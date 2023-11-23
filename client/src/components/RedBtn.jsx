const RedBtn = (props) => {
  const { onClick, disabled, children } = props;
  return (
    <button
      disabled={disabled}
      className="py-2 px-4 border-solid bg-red-700 radius text-white"
      onClick={(e) => {
        e.target.style.opacity = "0.7";
        onClick().then(() => {
          e.target.style.opacity = null;
        });
      }}
    >
      {children}
    </button>
  );
};

export default RedBtn;
