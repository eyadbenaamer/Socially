import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = (props) => {
  const { to, name, children } = props;
  const link = useRef(null);
  const location = useLocation();
  return (
    <li className="w-full">
      <Link onClick={() => window.scrollTo({ top: 0 })} to={to}>
        <div className="icon bg-hovered text-hovered bg-hovered text-hovered flex gap-3 items-center  px-3 py-2 radius">
          <span className="w-9">{children}</span>
          <span className={`${location.pathname === to && "primary-text"}`}>
            {name}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
