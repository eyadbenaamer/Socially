const PrimaryBtn = (props) => {
  const { onClick, disabled, children } = props;
  return (
    <button
      disabled={disabled}
      className="py-1 px-4 border-solid bg-100 radius"
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
