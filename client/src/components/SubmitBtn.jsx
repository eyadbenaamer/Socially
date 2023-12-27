const SubmitBtn = (props) => {
  const { onClick, disabled, children, tabIndex } = props;
  return (
    <button
      tabIndex={1}
      disabled={disabled}
      className="py-2 px-4 border-solid bg-primary radius text-white disabled:opacity-70"
      onClick={() => !disabled && onClick()}
    >
      {children}
    </button>
  );
};

export default SubmitBtn;
