import { Link } from "react-router-dom";

const BarItem = (props) => {
  const { to, children } = props;

  return (
    <li className="w-full">
      <Link
        className="flex justify-center"
        onClick={() => window.scrollTo({ top: 0 })}
        to={to}
      >
        <div className="bg-hovered flex gap-3 items-center px-3 py-1 rounded-xl">
          <span className="w-9 flex justify-center">{children}</span>
        </div>
      </Link>
    </li>
  );
};

export default BarItem;
