const PrimaryBtn = (props) => {
  const { onClick, disabled, children } = props;
  return (
    <button
      disabled={disabled}
      className="py-2 px-4 border-solid bg-300 radius"
      onClick={(e) => {
        e.target.style.opacity = "0.7";
        onClick();
        e.target.style.opacity = null;
      }}
    >
      {children}
    </button>
  );
};

export default PrimaryBtn;
