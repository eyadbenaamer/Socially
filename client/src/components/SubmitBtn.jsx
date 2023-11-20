const SubmitBtn = (props) => {
  const { onClick, disabled, children } = props;
  return (
    <button
      disabled={disabled}
      className="py-2 px-4 border-solid bg-primary radius text-inverse"
      onClick={(e) => {
        e.target.style.background = "#899dfc";
        onClick();
        e.target.style.background = null;
      }}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
