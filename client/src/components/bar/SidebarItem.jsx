import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const BarItem = (props) => {
  const { to, children } = props;
  return (
    <li className="w-full">
      <Link
        className="flex justify-center"
        onClick={() => window.scrollTo({ top: 0 })}
        to={to}
      >
        <div className="icon bg-hovered text-hovered bg-hovered text-hovered flex gap-3 items-center px-3 py-2 radius">
          <span className="w-9 flex justify-center">{children}</span>
        </div>
      </Link>
    </li>
  );
};

export default BarItem;
